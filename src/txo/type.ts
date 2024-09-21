import { BET_TYPE } from "../bet/constant";

export type PlayerRequestBet = {
    betType: BET_TYPE;
    amount: string;
}