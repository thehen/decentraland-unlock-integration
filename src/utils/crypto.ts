import { toBigNumber, isBigNumber } from "eth-connect"

/**
 * Inspired from https://github.com/decentraland/eth-connect/blob/2254a2d7a695f5b0deb51b796082d2072b65af86/src/utils/utils.ts#L373
 * @param num
 * @param decimals
 * @returns
 */
export function fromDecimals(num: number | string, decimals: number) {
    let returnValue = toBigNumber(num).dividedBy(decimals)

    return isBigNumber(num) ? returnValue : returnValue.toString(10)
}