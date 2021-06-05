import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory, TransactionReceipt, fromWei, BigNumber, fromDecimal } from "eth-connect"
import { getProvider, Provider } from '@decentraland/web3-provider'

import unlockABI from './abis/unlock'
import erc20ABI from './abis/erc20'

const REFERRER: string = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"
const POLL_FREQ: float = 1000; // ms delay between checking transaction reciept
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
            await setReciept(hash)
            return true
        } catch (error) {
            log(error)
            return false
        }
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
            // Need to get price
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

export class Poll implements ISystem {
    timeSinceLastCheck = 0;
    async update(dt: number) {
        this.timeSinceLastCheck += dt
        if (this.timeSinceLastCheck > POLL_FREQ) {
            this.timeSinceLastCheck = 0;
            for (const hash in transactionReciepts) {
                if (transactionReciepts[hash] == null) {
                    await setReciept(hash)
                    log(transactionReciepts[hash])
                }
            }
        }
    }
}

// Add system to engine
engine.addSystem(new Poll())


