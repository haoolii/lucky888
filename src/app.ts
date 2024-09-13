import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { FastThreeBettingSystem } from "./games/fast-three";
import express from "express";

const delay = (milliseconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), milliseconds);
  });
};

const app = express();
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const PORT = process.env.PORT || 1234;

const main = async () => {
  // 健康檢查
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const bot = new TelegramBot(TOKEN, { polling: true });

  const roll = async () => {
    return (await bot.sendDice("-4550812437")).dice?.value || 0;
  };

  const notification = async (msg: string) => {
    await bot.sendMessage("-4550812437", msg);
  };

  const fastThreeBetting = new FastThreeBettingSystem(roll, notification);

  const run = async () => {
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
