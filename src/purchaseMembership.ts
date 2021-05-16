import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory } from "eth-connect"

import UnlockABI from './abis/Unlock'

const REFERRER = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"

export const purchaseMembership = async (provider: any, lockAddress: string) => {
    const requestManager = new RequestManager(provider)
    const factory = new ContractFactory(requestManager, UnlockABI)
    const lock = await factory.at(lockAddress) as any;
    const address = await getUserAccount()

    var actualAmount = await lock.keyPrice()
    var referrer = REFERRER
    var data = new Array<number>();

    const transactionOptions = {
      from: address,
      to: lockAddress,
      value: actualAmount,
    };

    return await lock.purchase(actualAmount, address, referrer, data, transactionOptions);
}
