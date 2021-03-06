import * as ethereumController from '@decentraland/EthereumController'
import * as ethConnect from "eth-connect"
import { getProvider, Provider } from '@decentraland/web3-provider'
import delay from '../utils/delay'
import { fromDecimals } from '../utils/crypto'
import * as events from "./events"
import * as crypto from '@dcl/crypto-scene-utils'

import unlockABI from '../abis/unlock'
import erc20ABI from '../abis/erc20'

const REFERRER: string = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"
const POLL_FREQ: float = 2000;
const POLL_TIMEOUT: float = 1000000;
const ZERO: string = "0x0000000000000000000000000000000000000000";

let transactionReciepts: { [key: string]: ethConnect.TransactionReceipt } = {};

let provider: Provider
let requestManager: ethConnect.RequestManager
let factory: ethConnect.ContractFactory
let address: string

/** Class representing a lock. */
export class Lock {
    public isInitialised: Boolean = false
    readonly lockAddress: string
    private contract: any

    private erc20Factory: ethConnect.ContractFactory
    private erc20Contract: any

    private tokenAddress: string = ""

    constructor(
        lockAddress: string
    ) {
        this.lockAddress = lockAddress
        this.init()
    }

    /**
     * Initialises the lock
     */
    private init = async () => {
        address = await ethereumController.getUserAccount()
        provider = await getProvider()
        requestManager = new ethConnect.RequestManager(provider)
        factory = new ethConnect.ContractFactory(requestManager, unlockABI)
        this.contract = await factory.at(this.lockAddress) as any;

        try {
            this.tokenAddress = await this.contract.tokenAddress();
        } catch {
            throw new Error("Address now found. Is the lock on the correct network?")
        }

        // erc20 contract
        this.erc20Factory = new ethConnect.ContractFactory(requestManager, erc20ABI)
        this.erc20Contract = await this.erc20Factory.at(this.tokenAddress) as any;

        let hasValidKey = await this.getHasValidKey()

        this.isInitialised = true
        events.eventManager.fireEvent(new events.LockInitialised(this, hasValidKey))
    }

    /**
     * Purchase a membership
     */
    public purchaseMembership = async () => {
        const actualAmount = await this.contract.keyPrice()
        const data = new Array<number>();

        const transactionOptions: any = {
            from: address,
            to: this.lockAddress,
            value: actualAmount,
        };

        // Custom token
        if (this.tokenAddress !== ZERO) {
            const isApproved = await crypto.currency.isApproved(this.tokenAddress, address, this.lockAddress)
            let allowance = await crypto.currency.allowance(this.tokenAddress, address, this.lockAddress) as unknown as string
            if (!isApproved || ethConnect.toBigNumber(allowance).lt(actualAmount)) {
                try {
                    await crypto.currency.setApproval(this.tokenAddress, this.lockAddress, true, actualAmount)
                    events.eventManager.fireEvent(new events.ApprovalSuccess(this))
                } catch (error) {
                    events.eventManager.fireEvent(new events.ApprovalFail(this))
                    return
                }
            }
            transactionOptions.gasLimit = 500000
        } else {
            transactionOptions.value = actualAmount
        }

        // Purchase events
        let hash = null
        try {
            hash = await this.contract.purchase(actualAmount, address, REFERRER, data, transactionOptions);
            this.setReciept(hash)
            events.eventManager.fireEvent(new events.PurchaseSuccess(this))
        } catch (error) {
            events.eventManager.fireEvent(new events.PurchaseFail(this))
            return
        }

        // Transaction events
        const reciept = await this.waitForTransactionConfirmation(hash)
        if (reciept?.status == '0x1') {
            events.eventManager.fireEvent(new events.TransactionSuccess(this))
        } else {
            events.eventManager.fireEvent(new events.TransactionFail(this))
        }
    }

    /**
     * Check if the user has a valid key
     * @returns { boolean } - is key valid
     */
    public getHasValidKey = async () => {
        return await this.contract.getHasValidKey(address)
    }

    /**
     * Gets the price of the lock 
     * @returns { any } - the price in token currency
     */
    public getPrice = async () => {
        let keyPrice = await this.contract.keyPrice()

        if (this.tokenAddress === ZERO) {
            keyPrice = ethConnect.fromWei(keyPrice, 'ether')
        }
        else {
            const decimals = await this.erc20Contract.decimals()
            keyPrice = fromDecimals(keyPrice, 10 ** decimals)
        }

        return keyPrice
    }

    /**
     * Gets the token symbol
     * @returns { string } - the token symbol 
     */
    public getSymbol = async () => {
        let symbol = "ETH"
        if (this.tokenAddress != ZERO) {
            try {
                symbol = await this.erc20Contract.symbol()
            } catch (e) {
                symbol = ""
                throw new Error("Some ERC20 contracts, including DAI do not have the right symbol method.")
            }
        }
        return symbol
    }

    /**
     * Async function to poll a transaction and wait for completion or failure
     * @param { string } hash the transaction hash
     * @returns transaction reciept
     */
    private waitForTransactionConfirmation = async (hash: string) => {
        let time = 0
        while (transactionReciepts[hash] === null || transactionReciepts[hash] === undefined) {
            await delay(POLL_FREQ)
            this.setReciept(hash)
            time += POLL_FREQ

            if (time >= POLL_TIMEOUT) {
                return null
            }
        }

        return transactionReciepts[hash]
    }

    /**
     * Updates the transaction receipt object with latest reciept from hash
     * @param { string } hash the transaction hash
     */
    private setReciept = async (hash: string) => {
        transactionReciepts[hash] = await requestManager.eth_getTransactionReceipt(hash)
    }

}

