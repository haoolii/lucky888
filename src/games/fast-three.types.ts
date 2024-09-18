// import { convertBetTypeToString } from "./fast-three-parsebet";

export type RollThirdPartyFn = () => Promise<number>;

export type ThirdPartyNotificationFn = (msg: string) => Promise<void>;

export type ThirdPartyNotificationHtmlFn = (msg: string) => Promise<void>;

export type Player = {
  id: string;
  name?: string;
};
export enum BetType {
  BIG_ODD = "BIG_ODD",
  BIG_EVEN = "BIG_EVEN",
  SMALL_ODD = "SMALL_ODD",
  SMALL_EVEN = "SMALL_EVEN",
  BIG = "BIG",
  SMALL = "SMALL",
  ODD = "ODD",
  EVEN = "EVEN",
  TRIPLE = "TRIPLE",
}

export type Bet = {
  player: Player;
  betType: BetType;
  amount: string;
};

export enum BettingStatus {
  NOT_STARTED = "NOT_STARTED",
  BETTING = "BETTING",
  LOCK_BETS = "LOCK_BETS",
  DRAWING = "DRAWING",
  PAYOUT = "PAYOUT",
  RESETTING = "RESETTING",
}

export const betOdds: { [key in BetType]: number } = {
  [BetType.BIG_ODD]: 1.95, // 大單
  [BetType.BIG_EVEN]: 1.95, // 大雙
  [BetType.SMALL_ODD]: 1.95, // 小單
  [BetType.SMALL_EVEN]: 1.95, // 小雙
  [BetType.BIG]: 1.85, // 大
  [BetType.SMALL]: 1.85, // 小
  [BetType.ODD]: 1.85, // 單
  [BetType.EVEN]: 1.85, // 雙
  [BetType.TRIPLE]: 10, // 圍骰
};
