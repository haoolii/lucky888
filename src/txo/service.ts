/**
 * 下單機 Function
 */
import BigNumber from "bignumber.js";
import logger from "../core/logger";
import prisma from "../db";
import { getPlayerBalanceInfo, lockPlayerBalance } from "../player/service";
import { sumPlayerRequestBets } from "./util";
import { PlayerRequestBet } from "./type";
import { getCurrentRound } from "../round/service";
import { USER_BET_STATUS } from "../player/constant";
import { SystemError } from "../core/error";
import { queue } from "../core/queue";

/** 用戶下注 */
export const playerRequestPlaceBetTx = async (
  playerId: string,
  requestBets: PlayerRequestBet[]
) => {
  await queue.add(async () => {
    await prisma.$transaction(async (tx) => {
      const requestTotalAmount = sumPlayerRequestBets(requestBets);

      logger.info(`PlayerID: ${playerId}, 下注總額: ${requestTotalAmount}`);

      // 1. 檢查餘額
      const { availableBalance } = await getPlayerBalanceInfo(tx, playerId);

      logger.info(`PlayerID: ${playerId}, 可用餘額: ${availableBalance}`);

      // 2. 判斷是否超出餘額
      if (BigNumber(requestTotalAmount).isGreaterThan(availableBalance)) {
        throw new Error(
          `Insufficient available balance, available balance: ${availableBalance}`
        );
      }

      // 3. 開始下注
      const currentRound = await getCurrentRound(tx);

      if (!currentRound) {
        throw new SystemError("Current round is not exist");
      }

      logger.info(`PlayerID: ${playerId}, ${currentRound.id}期賭局`);

      await tx.playerBetRecord.createMany({
        data: requestBets.map((requestBet) => ({
          roundId: currentRound.id,
          playerId,
          betType: requestBet.betType,
          amount: requestBet.amount,
          status: USER_BET_STATUS.PLACED,
        })),
      });

      // 4. 鎖定餘額
      await lockPlayerBalance(tx, playerId, requestTotalAmount);

      // 5. logger 剩餘餘額
      const { availableBalance: after } = await getPlayerBalanceInfo(
        tx,
        playerId
      );

      logger.info(`PlayerID: ${playerId}, 下注後剩餘: ${after}`);
    });
  });
};

/** 用戶取消下注 */
// TODO
