import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory, TransactionReceipt, fromWei, BigNumber, toBigNumber, isBigNumber } from "eth-connect"
import { getProvider, Provider } from '@decentraland/web3-provider'
import delay from '../utils/delay'
import { fromDecimals } from '../utils/crypto'

import unlockABI from '../abis/unlock'
import erc20ABI from '../abis/erc20'

const REFERRER: string = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"
const POLL_FREQ: float = 2000;
const POLL_TIMEOUT: float = 1000000;
const ZERO: string = "0x0000000000000000000000000000000000000000";

let transactionReciepts: { [key: string]: TransactionReceipt } = {};

let provider: Provider
let requestManager: RequestManager
let factory: ContractFactory
let address: string

let erc20Factory: ContractFactory
let erc20Contract: any

export class Lock {
    private lockAddress: string
    private contract: any

    private tokenAddress: string = ""

    constructor(
        lockAddress: string
    ) {
        this.lockAddress = lockAddress
    }

    public init = async () => {
        address = await getUserAccount()
        provider = await getProvider()
        requestManager = new RequestManager(provider)
        factory = new ContractFactory(requestManager, unlockABI)

        this.contract = await factory.at(this.lockAddress) as any;
        this.tokenAddress = await this.contract.tokenAddress();

        // erc20 contract
        erc20Factory = new ContractFactory(requestManager, erc20ABI)
        erc20Contract = await erc20Factory.at(this.tokenAddress) as any;

        return
    }

    public purchaseMembership = async () => {
        const actualAmount = await this.contract.keyPrice()
        const data = new Array<number>();

        const transactionOptions = {
            from: address,
            to: this.lockAddress,
            value: actualAmount,
        };

        try {
            const hash = await this.contract.purchase(actualAmount, address, REFERRER, data, transactionOptions);
            setReciept(hash)
            return hash
        } catch (error) {
            return null
        }
    }

    public waitForTransactionConfirmation = async (hash: string) => {
        let time = 0
        while (transactionReciepts[hash] === null || transactionReciepts[hash] === undefined) {
            await delay(POLL_FREQ)
            setReciept(hash)
            time += POLL_FREQ

            if (time >= POLL_TIMEOUT) {
                return null
            }
        }

        return transactionReciepts[hash]
    }

    public getHasValidKey = async () => {
        return await this.contract.getHasValidKey(address)
    }

    public getPrice = async () => {
        let keyPrice = await this.contract.keyPrice()

        if (this.tokenAddress === ZERO) {
            keyPrice = fromWei(keyPrice, 'ether')
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
                log("Error: Some ERC20 contracts, including DAI do not have the right symbol method.")
            }
        }
        return symbol
    }

}

const setReciept = async (hash: string) => {
    transactionReciepts[hash] = await requestManager.eth_getTransactionReceipt(hash)
}