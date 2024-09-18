import BigNumber from "bignumber.js";
import { BetType } from "./fast-three.types";

const betTypeMap: { [key: string]: BetType } = {
  大單: BetType.BIG_ODD,
  大单: BetType.BIG_ODD,
  大雙: BetType.BIG_EVEN,
  大双: BetType.BIG_EVEN,
  小單: BetType.SMALL_ODD,
  小单: BetType.SMALL_ODD,
  小雙: BetType.SMALL_EVEN,
  小双: BetType.SMALL_EVEN,
  大: BetType.BIG,
  小: BetType.SMALL,
  單: BetType.ODD,
  单: BetType.ODD,
  雙: BetType.EVEN,
  双: BetType.EVEN,
};

const reverseBetTypeMap: { [key in BetType]: string } = {
  [BetType.BIG_ODD]: "大單",
  [BetType.BIG_EVEN]: "大雙",
  [BetType.SMALL_ODD]: "小單",
  [BetType.SMALL_EVEN]: "小雙",
  [BetType.BIG]: "大",
  [BetType.SMALL]: "小",
  [BetType.ODD]: "單",
  [BetType.EVEN]: "雙",
  [BetType.TRIPLE]: "圍骰",
};

function mapToBetType(type: string): BetType {
  const betType = betTypeMap[type];
  if (!betType) {
    throw new Error("未知的投注類型");
  }
  return betType;
}

function mapFromBetType(betType: BetType): string {
  const typeString = reverseBetTypeMap[betType];
  if (!typeString) {
    throw new Error("未知的 BetType");
  }
  return typeString;
}

export function inputStringParseToBetType(input: string) {
  const pattern = /(大單|大双|大雙|小單|小双|小雙|大|小|單|双|雙)(\d+)/g;
  const matches = input.matchAll(pattern);

  const result: any[] = [];

  for (const match of matches) {
    const [, stringType, amount] = match;
    const betType = mapToBetType(stringType);
    result.push({ betType, amount: BigNumber(amount).toString() });
  }

  return result;
}

export function convertBetTypeToString(betType: BetType) {
  return mapFromBetType(betType);
}
