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
import { rollDice } from "../game/gamfn";
import { MSG_KEY } from "../tg/key";
import { broadcast } from "../tg/tg";
import { ROUND_STATUS } from "./constant";
import { createRound, deleteCurrentRound, getCurrentRound, setCurrentRound, updateRoundDiceResult, updateRoundStatus } from "./round.service";

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

    await broadcast(MSG_KEY.ROUND_START_PAYOUT, {
        round: round.id,
        payoutRecords: []
    });

    await reset();
};

const reset = async () => {
    logger.info("[STATUS] Start Reset");

    const round = await getCurrentRound(db);

    await deleteCurrentRound(db);

    await updateRoundStatus(db, round.id, ROUND_STATUS.NOT_STARTED);

};

export {
    round
}