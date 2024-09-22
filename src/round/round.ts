/**
 * 骰子賭局管理
 * start     開始遊戲
 * beginbets 開始下注
 * lockBets  停止下注
 * draw      開獎
 * payout    派發下注
 * reset     重置遊戲
 */

import logger from "../core/logger";
import { delay } from "../core/utils";
import db from "../db";
import { MSG_KEY } from "../tg/key";
import { broadcast } from "../tg/tg";
import { ROUND_STATUS } from "./constant";
import { createRound, deleteCurrentRound, getCurrentRound, getRoundPlayerBets, setCurrentRound, updateRoundDiceResult, updateRoundStatus } from "./service";
import { calculatePlayerBetReward, rollDice, sanitizeDiceResult } from "./util";
import { RoundPlayerResultRecord } from "./type";
import { addPlayerBalance, createPlayerPayoutRecord, getPlayer, getPlayerBalanceInfo, subtractPlayerBalance, unlockPlayerBalance, updatePlayerBetRecord } from "../player/service";
import { BET_TYPE } from "../bet/constant";
import { USER_BET_STATUS } from "../player/constant";
import BigNumber from "bignumber.js";

const round = async () => {
    await start();
};

const start = async () => {
    logger.info("[STATUS] Start");

    await deleteCurrentRound(db);

    const round = await createRound(db);

    logger.info("[STATUS] Start Round", round.id);

    await setCurrentRound(db, round.id);

    await updateRoundStatus(db, round.id, ROUND_STATUS.NOT_STARTED);

    await delay(1000);

    await beginbets();
};

const beginbets = async () => {
    logger.info("[STATUS] Start Begin Bets");

    const round = await getCurrentRound(db);

    await updateRoundStatus(db, round.id, ROUND_STATUS.BETTING);

    await delay(1000);

    await broadcast(MSG_KEY.ROUND_START_BET, {
        round: round.id,
        during: 30
    });

    await delay(30000);

    await lockBets();
};

const lockBets = async () => {
    logger.info("[STATUS] Start Lock Bets");

    const round = await getCurrentRound(db);

    await delay(1000);

    await broadcast(MSG_KEY.ROUND_STOP_BET, {
        round: round.id
    });

    await updateRoundStatus(db, round.id, ROUND_STATUS.LOCK_BETS);

    await draw();
};

const draw = async () => {
    logger.info("[STATUS] Start Draw");

    const round = await getCurrentRound(db);

    await delay(1000);

    await broadcast(MSG_KEY.ROUND_PER_DRAW, {
        round: round.id
    });

    await updateRoundStatus(db, round.id, ROUND_STATUS.DRAWING);

    const results = (await rollDice()) || [];

    logger.info(JSON.stringify(results, null, 2));

    await updateRoundDiceResult(db, round.id, results);

    await delay(1000);

    await broadcast(MSG_KEY.ROUND_DRAW_RESULT, {
        round: round.id
    });

    await payout();
};

const payout = async () => {
    logger.info("[STATUS] Start Payout");

    const round = await getCurrentRound(db);

    await updateRoundStatus(db, round.id, ROUND_STATUS.PAYOUT);

    // 取得此局所有玩家下注紀錄
    const playerBetRecords = await getRoundPlayerBets(db, round.id);

    const diceResults = sanitizeDiceResult([round.dice1, round.dice2, round.dice3]);

    const roundPlayerResultRecords: Array<RoundPlayerResultRecord> = []

    for (let playerBetRecord of playerBetRecords) {
        if (!sanitizeDiceResult(diceResults)) {
            continue;
        }

        const { username } = await getPlayer(db, playerBetRecord.playerId);

        await db.$transaction(async tx => {
            // 減少玩家 balance
            await subtractPlayerBalance(tx, playerBetRecord.playerId, playerBetRecord.amount);

            // 解鎖玩家 lock balance
            await unlockPlayerBalance(tx, playerBetRecord.playerId, playerBetRecord.amount);

            // 計算玩家輸贏與倍率
            const { isWin, reward } = calculatePlayerBetReward(diceResults, playerBetRecord.betType as BET_TYPE, playerBetRecord.amount);

            // 更新玩家下注紀錄
            await updatePlayerBetRecord(tx, playerBetRecord.id, isWin ? USER_BET_STATUS.WIN : USER_BET_STATUS.LOST);

            // 增加贏家餘額
            await addPlayerBalance(tx, playerBetRecord.playerId, reward);

            // 寫入獎金紀錄
            await createPlayerPayoutRecord(tx, playerBetRecord.playerId, playerBetRecord.roundId, playerBetRecord.id, reward);

            // 產生訊息結果
            roundPlayerResultRecords.push({
                playerId: playerBetRecord.playerId,
                username,
                betType: playerBetRecord.betType as BET_TYPE,
                betAmount: playerBetRecord.amount,
                betResult: isWin ? '贏' : '輸',
                winLossAmount: BigNumber(reward).minus(playerBetRecord.amount).toString(),
                availableBalance: '-'
            })
        })
    }

    for (let record of roundPlayerResultRecords) {
        // 取得用戶餘額
        const { availableBalance } = await getPlayerBalanceInfo(db, record.playerId);

        record.availableBalance = availableBalance;
    }

    await broadcast(MSG_KEY.ROUND_START_PAYOUT, {
        round: round.id,
        records: roundPlayerResultRecords
    });

    await reset();
};

const reset = async () => {
    logger.info("[STATUS] Start Reset");

    const round = await getCurrentRound(db);

    await deleteCurrentRound(db);

    await updateRoundStatus(db, round.id, ROUND_STATUS.FINISHED);
};

export {
    round
}