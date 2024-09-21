import { PrismaClient } from "@prisma/client";
import { playerRequestPlaceBetTx } from "./txo/txo.service";
import { BET_TYPE } from "./game/constant";
import { updateRoundDiceResult } from "./round/round.service";

let prisma = new PrismaClient();

const main = async () => {
    await prisma.$transaction(async (tx) => {
        await updateRoundDiceResult(tx, '123', [1,2,3])
    })
}
main()

// async function simulateConcurrentOrder() {
//     const userId = "user_2";
//     const amount = 100;  // 假設訂單金額是 100

//     const requestBets = [{
//         betType: BET_TYPE.BIG,
//         amount: '100'
//     }, {
//         betType: BET_TYPE.ODD,
//         amount: '200'
//     }]

//     try {
//         // 使用 Promise.all 來模擬兩個併發的訂單請求
//         await Promise.all([
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//             playerRequestPlaceBetTx(userId, requestBets),
//         ]);
//     } catch (error: any) {
//         console.error("Error during bet:", error.message);
//     }
// }

// // 執行模擬併發
// simulateConcurrentOrder().finally(async () => {
//     await prisma.$disconnect();
// });