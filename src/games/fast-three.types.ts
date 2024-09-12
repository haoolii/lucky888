import BigNumber from "bignumber.js";

export enum BetType {
    BIG = "BIG",
    SMALL = "SMALL",
    ODD = "ODD",
    EVEN = "EVEN",
    TRIPLE = "TRIPLE",
}

export type Bet = {
    player: string;
    betType: BetType;
    amount: string;
}
