import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import FastThreeBettingSystem from "./games/fast-three-betting-system";
import config from "./config";
import { delay } from "./core/utils";

const main = async () => {
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

  const roll = async () => {
    return (await bot.sendDice(config.TELEGRAM_CHAT_ID)).dice?.value || 0;
  };

  const notification = async (msg: string) => {
    await bot.sendMessage(config.TELEGRAM_CHAT_ID, msg);
  };

  const fastThreeBetting = new FastThreeBettingSystem(roll, notification);

  const run = async () => {
    const memoryUsage = process.memoryUsage();
    console.log("==================================================");
    console.log("Memory Usage:");
    console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
    console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
    console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
    console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
    console.log(`Array Buffers: ${memoryUsage.arrayBuffers / 1024 / 1024} MB`);
    console.log("==================================================");
    await fastThreeBetting.start();
    await delay(30000);
    await fastThreeBetting.lockBets();
    await delay(1000);
    await fastThreeBetting.draw();
    await delay(1000);
    await fastThreeBetting.payout();
    await delay(1000);
    await fastThreeBetting.reset();
    // 在所有步驟完成後，設置下一次執行
    setTimeout(run, 5000);
  };
  run();
};

export default main;
