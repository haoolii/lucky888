import BigNumber from "bignumber.js";
import { BET_TYPE } from "./constant";

export const betTypeMap: { [key: string]: BET_TYPE } = {
    大單: BET_TYPE.BIG_ODD,
    大单: BET_TYPE.BIG_ODD,
    大雙: BET_TYPE.BIG_EVEN,
    大双: BET_TYPE.BIG_EVEN,
    小單: BET_TYPE.SMALL_ODD,
    小单: BET_TYPE.SMALL_ODD,
    小雙: BET_TYPE.SMALL_EVEN,
    小双: BET_TYPE.SMALL_EVEN,
    大: BET_TYPE.BIG,
    小: BET_TYPE.SMALL,
    單: BET_TYPE.ODD,
    单: BET_TYPE.ODD,
    雙: BET_TYPE.EVEN,
    双: BET_TYPE.EVEN,
};

export function mapToBetType(type: string): BET_TYPE {
    const betType = betTypeMap[type];
    if (!betType) {
        throw new Error("未知的投注類型");
    }
    return betType;
}

export const parseInputToBets = (input: string) => {
    const pattern = /(大單|大双|大雙|小單|小双|小雙|大|小|單|双|雙)(\d+(\.\d{1,2})?)/g;
    const matches = input.matchAll(pattern);

    const result = [];

    for (const match of matches) {
        const [, stringType, amount] = match;
        const betType = mapToBetType(stringType);
        result.push({ betType, amount: BigNumber(amount).toString() });
    }

    return result;
}