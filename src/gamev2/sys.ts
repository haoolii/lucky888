import logger from "../core/logger";
import { delay } from "../core/utils";
import { STATUS } from "./constant";
import Gam from "./gam";
import {
  createRound,
  deleteCurrentRound,
  getCurrentRound,
  getRoundPlayerBets,
  payoutRoundPlayer,
  setCurrentRound,
  updateRoundDiceResult,
  updateRoundStatus,
} from "./oper";
import { broadcast, diceRoll } from "./tg";

/**
 * 骰子賭局管理
 * start     開始遊戲
 * beginbets 開始下注
 * lockBets  停止下注
 * draw      開獎
 * payout    派發下注
 * reset     重置遊戲
 */
const sys = async () => {
  await start();
};

const start = async () => {
  logger.info("[STATUS] Start");

  await deleteCurrentRound();

  const round = await createRound();

  logger.info("[STATUS] Start Round", round?.id);

  if (!round) return;

  await setCurrentRound(round.id);

  await updateRoundStatus(round.id, STATUS.NOT_STARTED);

  await delay(1000);

  await broadcast(`(${round.id})期 即將開始`);

  await beginbets();
};

const beginbets = async () => {
  logger.info("[STATUS] Start Begin Bets");

  const round = await getCurrentRound();

  if (!round) return;

  await updateRoundStatus(round.id, STATUS.BETTING);

  await delay(1000);

  await broadcast(`(${round.id}), 開始下注 (300S)`);

  await delay(30000);

  await lockBets();
};

const lockBets = async () => {
  logger.info("[STATUS] Start Lock Bets");

  const round = await getCurrentRound();

  if (!round) return;

  await delay(1000);

  await broadcast(`(${round.id}), 停止下注`);

  await updateRoundStatus(round.id, STATUS.LOCK_BETS);

  await draw();
};

const draw = async () => {
  logger.info("[STATUS] Start Draw");

  const round = await getCurrentRound();

  if (!round) return;

  await delay(1000);

  await broadcast(`(${round.id}), 即將開獎`);

  await updateRoundStatus(round.id, STATUS.DRAWING);

  const gam = new Gam(async () => await diceRoll());

  const results = (await gam?.rollDice()) || [];

  const resultSummary = gam?.getResult();

  logger.info(results);

  await updateRoundDiceResult(round.id, results);

  await delay(1000);

  await broadcast(
    `(${round.id}), 開獎結果 <pre>${JSON.stringify(
      resultSummary,
      null,
      2
    )}</pre>`
  );

  await payout();
};

const payout = async () => {
  logger.info("[STATUS] Start Payout");

  const round = await getCurrentRound();

  if (!round) return;

  await updateRoundStatus(round.id, STATUS.PAYOUT);

  await broadcast(`(${round.id}), 開始派獎`);

  await delay(1000);

  await payoutRoundPlayer(round.id);

  await reset();
};

const reset = async () => {
  logger.info("[STATUS] Start Reset");

  const round = await getCurrentRound();

  if (!round) return;

  await delay(1000);

  await broadcast(`(${round.id}), 遊戲完成 重置遊戲中`);

  await updateRoundStatus(round.id, STATUS.RESETTING);

  await deleteCurrentRound();

  await updateRoundStatus(round.id, STATUS.FINISHED);
};

export { sys };
