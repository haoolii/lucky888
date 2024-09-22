import { BET_TYPE } from "../bet/constant";

export type RoundPlayerResultRecord = {
    playerId: string;
    username: string;
    betType: BET_TYPE;
    betAmount: string;
    betResult: string;
    winLossAmount: string; // 輸或贏多少錢
    availableBalance: string;
}