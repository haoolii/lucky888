export type RollThirdPartyFn = () => Promise<number>;

export type ThirdPartyNotificationFn = (msg: string) => Promise<void>;

export type Player = {
  id: string;
  name: string;
};

export enum BetType {
  BIG = "BIG",
  SMALL = "SMALL",
  ODD = "ODD",
  EVEN = "EVEN",
  TRIPLE = "TRIPLE",

  BIG_ODD = "BIG_ODD",  // 大單
  BIG_EVEN = "BIG_EVEN",// 大雙
  SMALL_ODD = "SMALL_ODD", // 小單
  SMALL_EVEN = "SMALL_EVEN", // 小雙
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
