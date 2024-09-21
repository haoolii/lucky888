/**
 * 下單機 Function
 */
import BigNumber from "bignumber.js";
import logger from "../core/logger";
import prisma from "../db";
import { BET_TYPE } from "../game/constant"
import { getPlayerBalanceInfo, lockPlayerBalance } from "../player/player.service";
import { sumPlayerRequestBets } from "./txo.utils";
import { getCurrentRound } from "../round/round.service";
import { USER_BET_STATUS } from "../player/constant";
import { PlayerRequestBet } from "./type";

/** 用戶下注 */
export const playerRequestPlaceBetTx = async (playerId: string, requestBets: PlayerRequestBet[]) => {
    await prisma.$transaction(async (tx) => {

        const requestTotalAmount = sumPlayerRequestBets(requestBets);

        logger.info(`PlayerID: ${playerId}, 下注總額: ${requestTotalAmount}`);

        // 1. 檢查餘額
        const { availableBalance } = await getPlayerBalanceInfo(tx, playerId);

        logger.info(`PlayerID: ${playerId}, 可用餘額: ${availableBalance}`);

        // 2. 判斷是否超出餘額
        if (BigNumber(requestTotalAmount).isGreaterThan(availableBalance)) {
            throw new Error(`Insufficient available balance, available balance: ${availableBalance}`);
        }

        // 3. 開始下注
        const currentRound = await getCurrentRound(tx);

        logger.info(`PlayerID: ${playerId}, ${currentRound.id}期賭局`);

        await tx.playerBetRecord.createMany({
            data: requestBets.map(requestBet => ({
                roundId: currentRound.id,
                playerId,
                betType: requestBet.betType,
                amount: requestBet.amount,
                status: USER_BET_STATUS.PLACED
            }))
        })

        // 4. 鎖定餘額
        await lockPlayerBalance(tx, playerId, requestTotalAmount);
    });
}

/** 用戶取消下注 */
// TODO