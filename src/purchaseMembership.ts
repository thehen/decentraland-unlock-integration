import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory } from "eth-connect"
import { getProvider, Provider } from '@decentraland/web3-provider'

import UnlockABI from './abis/Unlock'

const REFERRER: string = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"

let provider: Provider
let requestManager: RequestManager
let factory: ContractFactory

export const initialise = async () => {
  provider = await getProvider()
  requestManager = new RequestManager(provider)
  factory = new ContractFactory(requestManager, UnlockABI)
  return
}

const getLock = async (lockAddress: string) => {
  const lock = await factory.at(lockAddress) as any;
  return lock;
}

export const purchaseMembership = async (lockAddress: string) => {
  let lock = await getLock(lockAddress)
  const address = await getUserAccount()
  var actualAmount = await lock.keyPrice()

  var referrer = REFERRER
  var data = new Array<number>();

  const transactionOptions = {
    from: address,
    to: lockAddress,
    value: actualAmount,
  };

  try {
    const hash = await lock.purchase(actualAmount, address, referrer, data, transactionOptions);

    // Todo add delay to polling
    let receipt = null
    while (receipt === null) {
      receipt = await requestManager.eth_getTransactionReceipt(hash)
    }

    return true
  } catch (error) {
    log(error)
    return false
  }
}

export const getPrice = async (lockAddress: string) => {

  /* Todo: look at getLock.js in Unlock-js
  const lock = await getLock(lockAddress)
  const price = await lock.keyPrice()
  const tokenAddress = await lock.tokenAddress()
  const contract = await crypto.currency.getContract(tokenAddress)
  */

  return 0.1
}

export const getSymbol = async (lockAddress: string) => {

  /*
  const lock = await getLock(lockAddress)
  const tokenAddress = await lock.tokenAddress()
  const contract = await crypto.currency.getContract(tokenAddress)
  const symbol = contract.contract.symbol()
  return symbol
  */

  return "ETH"
}
