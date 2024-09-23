import { playerRequestPlaceBetTx } from "../txo/service";
import { BET_TYPE } from "../bet/constant";
import { createRound, setCurrentRound } from "../round/service";
import db from "../db";
import PQueue from "p-queue";

const queue = new PQueue({concurrency: 1});

const genReq = (id: string, reqs: number[]) => {
  try {
    return queue.add(() => {
      return playerRequestPlaceBetTx(
        id,
        reqs.map((req) => ({
          betType: BET_TYPE.BIG,
          amount: `${req}`,
        }))
      );
    });
  } catch (err) {
    console.log('Queue 錯誤', err)
    return ''
  }
};
/** 1. 大量下單超出餘額 */
const race1 = async () => {
  // 建立 Round
  const round = await createRound(db);

  await setCurrentRound(db, round.id);

  // 可用餘額 1800
  const player1 = await db.player.upsert({
    where: {
      id: "TEST_PLAYER_1",
    },
    update: {
      balance: "1800",
      lockedBalance: "0",
    },
    create: {
      id: "TEST_PLAYER_1",
      balance: "1800",
      lockedBalance: "0",
    },
  });

  // 使用 Promise.all 來模擬高併發
  const startTime = Date.now();

  try {
    await Promise.all([
      genReq(player1.id, [5000]),
      genReq(player1.id, [4000]),
      genReq(player1.id, [100]),
    ]);
  } catch (err) {
    console.log('Promise 錯誤', err)
  }
  const endTime = Date.now(); // 锁定结束时间
  console.log(`During time: ${endTime - startTime} ms`);
};

const main = async () => {
  try {
    await race1();
  } catch (err: any) {
    console.log("錯誤發生", err.message);
  }
};

main();
