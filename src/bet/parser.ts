import BigNumber from "bignumber.js";
import { BET_TYPE, betTypeMap } from "./constant";

export function mapToBetType(type: string): BET_TYPE {
    const betType = betTypeMap[type];
    if (!betType) {
        throw new Error("未知的投注類型");
    }
    return betType;
}

export const parseInputToBets = (input: string) => {
    const pattern =
        /(大單|大双|大雙|小單|小双|小雙|大|小|單|双|雙)(\d+(\.\d{1,2})?)/g;
    const matches = input.matchAll(pattern);

    const result: { betType: BET_TYPE; amount: string }[] = [];

    for (const match of matches) {
        const [, stringType, amount] = match;
        const betType = mapToBetType(stringType);
        result.push({ betType, amount: BigNumber(amount).toString() });
    }

    return result;
};