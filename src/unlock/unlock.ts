import * as ethereumController from '@decentraland/EthereumController'
import * as ethConnect from "eth-connect"
import { getProvider, Provider } from '@decentraland/web3-provider'
import delay from '../utils/delay'
import { fromDecimals } from '../utils/crypto'
import * as events from "./events"

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

let erc20Factory: ethConnect.ContractFactory
let erc20Contract: any

export class Lock {
    public isInitialised: Boolean = false
    private lockAddress: string
    private contract: any

    private tokenAddress: string = ""

    constructor(
        lockAddress: string
    ) {
        this.lockAddress = lockAddress
        this.init()
    }

    public init = async () => {
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
        erc20Factory = new ethConnect.ContractFactory(requestManager, erc20ABI)
        erc20Contract = await erc20Factory.at(this.tokenAddress) as any;

        // Initialised event
        let hasValidKey = await this.getHasValidKey()

        this.isInitialised = true
        events.eventManager.fireEvent(new events.LockInitialised(this, hasValidKey))

    }

    public purchaseMembership = async () => {
        const actualAmount = await this.contract.keyPrice()
        const data = new Array<number>();

        const transactionOptions = {
            from: address,
            to: this.lockAddress,
            value: actualAmount,
        };

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

    public getHasValidKey = async () => {
        return await this.contract.getHasValidKey(address)
    }

    public getPrice = async () => {
        let keyPrice = await this.contract.keyPrice()

        if (this.tokenAddress === ZERO) {
            keyPrice = ethConnect.fromWei(keyPrice, 'ether')
        }
        else {
            const decimals = await erc20Contract.decimals()
            keyPrice = fromDecimals(keyPrice, 10 ** decimals)
        }

        return keyPrice
    }

    public getSymbol = async () => {
        let symbol = "ETH"
        if (this.tokenAddress != ZERO) {
            try {
                symbol = await erc20Contract.symbol()
            } catch (e) {
                symbol = ""
                throw new Error("Some ERC20 contracts, including DAI do not have the right symbol method.")
            }
        }
        return symbol
    }

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

    private setReciept = async (hash: string) => {
        transactionReciepts[hash] = await requestManager.eth_getTransactionReceipt(hash)
    }

}