import { BET_TYPE } from "./constant";

export type Player = {
    id: string;
    name?: string;
};

export type Bet = {
    player: Player;
    betType: BET_TYPE;
    amount: string;
};