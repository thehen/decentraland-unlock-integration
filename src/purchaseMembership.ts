import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory } from "eth-connect"
import { getProvider } from '@decentraland/web3-provider'
import * as crypto from '@dcl/crypto-scene-utils'

import UnlockABI from './abis/Unlock'

const REFERRER = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"

export const purchaseMembership = async (lockAddress: string) => {
  const lock = await getLock(lockAddress)
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
    const transactionPromise = await lock.purchase(actualAmount, address, referrer, data, transactionOptions);
    log("success")
    return true
  } catch {
    log("fail")
    return false
  }

}

const getLock = async (lockAddress: string) => {
  const provider = await getProvider()
  const requestManager = new RequestManager(provider)
  const factory = new ContractFactory(requestManager, UnlockABI)
  const lock = await factory.at(lockAddress) as any;
  return lock;
}

const handleMethodCall = async (methodCall: any) => {
  const transaction = await methodCall;

  if (transaction.hash) {
    return transaction.hash;
  }

  const finalTransaction = await transaction.wait();
  return finalTransaction.hash; // errors fall through
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
