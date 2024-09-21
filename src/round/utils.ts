import BigNumber from "bignumber.js";
import { diceRoll } from "../tg/tg";
import { delay } from "../core/utils";
import { BET_TYPE } from "../bet/constant";
import { PlayerBetRecord } from "@prisma/client";
import { PlayerBetPayout } from "./types";

type DiceResult = {
  diceResults: number[];
  total: number;
  isBig: boolean;
  isSmall: boolean;
  isOdd: boolean;
  isEven: boolean;
  isTriple: boolean;
  isBigOdd: boolean;
  isBigEven: boolean;
  isSmallOdd: boolean;
  isSmallEven: boolean;
};

/**
 * 計算骰子結果的相關判斷邏輯
 */
function calculateDiceResult(diceResults: number[]): DiceResult {
  const total = diceResults.reduce((prev, curr) => curr + prev, 0);
  const isBig = total >= 11 && total <= 17;
  const isSmall = total >= 4 && total <= 10;
  const isOdd = total % 2 !== 0;
  const isEven = total % 2 === 0;
  const isTriple =
    diceResults[0] === diceResults[1] && diceResults[1] === diceResults[2];
  const isBigOdd = isBig && isOdd;
  const isBigEven = isBig && isEven;
  const isSmallOdd = isSmall && isOdd;
  const isSmallEven = isSmall && isEven;

  return {
    diceResults,
    total,
    isBig,
    isSmall,
    isOdd,
    isEven,
    isTriple,
    isBigOdd,
    isBigEven,
    isSmallOdd,
    isSmallEven,
  };
}

export async function rollDice() {
  let diceResults: Array<number> = [];
  try {
    diceResults.push(await diceRoll());
    await delay(1000);
    diceResults.push(await diceRoll());
    await delay(1000);
    diceResults.push(await diceRoll());
    return diceResults;
  } catch (err) {
    throw new Error("擲骰子過程出錯了");
  }
}

/**
 * 根據 BET_TYPE 判斷是否贏得投注
 */
export function checkBetResult(
  diceResults: number[],
  betType: BET_TYPE
): boolean {
  const result = calculateDiceResult(diceResults);

  switch (betType) {
    case BET_TYPE.BIG_ODD:
      return result.isBigOdd;
    case BET_TYPE.BIG_EVEN:
      return result.isBigEven;
    case BET_TYPE.SMALL_ODD:
      return result.isSmallOdd;
    case BET_TYPE.SMALL_EVEN:
      return result.isSmallEven;
    case BET_TYPE.BIG:
      return result.isBig;
    case BET_TYPE.SMALL:
      return result.isSmall;
    case BET_TYPE.ODD:
      return result.isOdd;
    case BET_TYPE.EVEN:
      return result.isEven;
    case BET_TYPE.TRIPLE:
      return result.isTriple;
    default:
      return false; // 未知的投注類型
  }
}

/**
 * 返回完整的遊戲結果
 */
export function getGameResult(diceResults: number[]): DiceResult {
  return calculateDiceResult(diceResults);
}

/**
 * 賠率
 */
export const betOdds: { [key in BET_TYPE]: number } = {
  [BET_TYPE.BIG_ODD]: 1.95, // 大單
  [BET_TYPE.BIG_EVEN]: 1.95, // 大雙
  [BET_TYPE.SMALL_ODD]: 1.95, // 小單
  [BET_TYPE.SMALL_EVEN]: 1.95, // 小雙
  [BET_TYPE.BIG]: 1.85, // 大
  [BET_TYPE.SMALL]: 1.85, // 小
  [BET_TYPE.ODD]: 1.85, // 單
  [BET_TYPE.EVEN]: 1.85, // 雙
  [BET_TYPE.TRIPLE]: 10, // 圍骰
};

/**
 * 外部計算獎金
 */
export function calculatePayout(
  isWin: boolean,
  betType: BET_TYPE,
  betAmount: string
): string {
  return isWin ? BigNumber(betAmount).times(betOdds[betType]).toString() : "0";
}

// PlayerBetPayout
export function getPlayerBetPayouts(records: PlayerBetRecord[], diceResults: number[]) {
    let playerBetPayouts: PlayerBetPayout = [];

    for(let record of records) {
        const betType = record.betType as BET_TYPE;
        const amount = record.amount || "0";
        const isWin = checkBetResult(diceResults, betType);
        const winAmount = calculatePayout(isWin, betType, amount);
        const lostAmount = BigNumber(amount).times(-1).toString();
        const payoutAmount = isWin ? winAmount : lostAmount;
    }
}