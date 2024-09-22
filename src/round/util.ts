import BigNumber from "bignumber.js";
import { diceRoll } from "../tg/tg";
import { delay } from "../core/utils";
import { BET_TYPE } from "../bet/constant";

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

// 計算玩家獎金結果
export function calculatePlayerBetReward(
  diceResults: number[],
  betType: BET_TYPE,
  betAmount: string
) {
  const isWin = checkBetResult(diceResults, betType);
  return {
    isWin: isWin,
    reward: isWin ? BigNumber(betAmount).times(betOdds[betType]).toString() : "0"
  }
}

// 確保結果
export function sanitizeDiceResult(diceResults: Array<number | null>): number[] {
  // 檢查陣列長度是否為 3
  if (diceResults.length !== 3) {
    throw new Error('Dice result must have exactly 3 values.');
  }

  // 檢查所有元素是否為非 null 且為有效的數字
  if (!diceResults.every(dice => dice !== null && typeof dice === 'number')) {
    throw new Error('All dice results must be non-null numbers.');
  }

  return diceResults;
}

// 產生派獎結果資訊
export function getRoundPayoutResultMsg() {

}