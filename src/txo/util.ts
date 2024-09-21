import BigNumber from "bignumber.js";
import { PlayerRequestBet } from "./type";

export const sumPlayerRequestBets = (bets: PlayerRequestBet[]) => {
    let sum = new BigNumber(0);
    for(let bet of bets) {
        sum = sum.plus(bet.amount);
    }
    return sum.toString();
}