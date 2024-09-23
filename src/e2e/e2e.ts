import { playerRequestPlaceBetTx } from "../txo/service";
import { BET_TYPE } from "../bet/constant";
import { createRound, setCurrentRound } from "../round/service";
import db from "../db";
import PQueue from "p-queue";
import BigNumber from "bignumber.js";

const queue = new PQueue({ concurrency: 1 });

let count = 0;
queue.on("active", () => {
  console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
});

// 單次多筆下單
const genSingleReq = (id: string, amounts: number[]) => {
  try {
    return queue.add(() => {
      return playerRequestPlaceBetTx(
        id,
        amounts.map((amount) => ({
          betType: BET_TYPE.BIG,
          amount: `${amount}`,
        }))
      );
    });
  } catch (err) {
    console.log("Queue 錯誤", err);
    return Promise.reject(err);
  }
};

// 分次多筆下單
const genMultipleReqs = (id: string, amounts: number[]) => {
  return Promise.all(
    amounts.map((amount) => genSingleReq(id, [amount])) // 每次只下單一筆
  );
};

// 測試下單並驗證最終餘額
const raceTest = async (isSingleBatch: boolean, amounts: number[], expectedFinalBalance: number) => {
  // 建立 Round
  const round = await createRound(db);
  await setCurrentRound(db, round.id);

  // 設定玩家初始餘額
  const player1 = await db.player.upsert({
    where: { id: "TEST_PLAYER_1" },
    update: { balance: "1800", lockedBalance: "0" },
    create: { id: "TEST_PLAYER_1", balance: "1800", lockedBalance: "0" },
  });

  const startTime = Date.now();

  // 根據 isSingleBatch 判斷是單次多筆還是分次多筆下單
  try {
    if (isSingleBatch) {
      console.log("單次多筆下單");
      await genSingleReq(player1.id, amounts);
    } else {
      console.log("分次多筆下單");
      await genMultipleReqs(player1.id, amounts);
    }
  } catch (err) {
    console.log("Promise 錯誤", err);
  }

  const endTime = Date.now();
  console.log(`Duration: ${endTime - startTime} ms`);

  // 驗證玩家最終餘額
  const player = await db.player.findUnique({
    where: { id: "TEST_PLAYER_1" },
  });
  if (player) {
    const finalBalance = BigNumber(player?.balance).minus(player?.lockedBalance).toNumber();
    console.log(`Final Player Balance: ${finalBalance}`);
    console.log(`Expected Balance: ${expectedFinalBalance}`);
    if (finalBalance === expectedFinalBalance) {
      console.log("Test Passed: Final balance matches expected balance.");
    } else {
      console.log("Test Failed: Final balance does not match expected balance.");
    }
  }
};

// 測試各種情況
const main = async () => {
  try {
    console.log("Test 1: 分次多筆下單 (500, 1000, 1000)");
    // 餘額1800, 預期最後餘額是300，因為 500 + 1000 被執行，最後一筆 1000 被拒絕
    await raceTest(false, [500, 1000, 1000], 300);

    console.log("Test 2: 單次多筆下單 (500, 1000, 1000)");
    // 餘額1800, 預期最後餘額是1800，因為整筆 500 + 1000 + 1000 無法執行
    await raceTest(true, [500, 1000, 1000], 1800);
  } catch (err: any) {
    console.log("錯誤發生", err.message);
  }
};

main();
