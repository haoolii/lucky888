import TelegramBot from "node-telegram-bot-api";
import UserService from "./user/user.service";
import FastThreeBettingSystem from "./games/fast-three-betting-system";
import config from "./config";
import { fastThreeParseBet } from "./games/fast-three-parsebet";
import { delay } from "./core/utils";

/**
 * 賭場管理 Betting Management Class
 * 可使用 Telegram Bot
 * 可存取 User Service
 * 可存取賭局
 */
export default class BettingManagement {
  bettingSystem?: FastThreeBettingSystem;

  userService?: UserService;

  // TEMP
  bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

  constructor() {
    this.bettingSystem = new FastThreeBettingSystem(
      this.roll,
      this.notification,
      this.notification2
    );
    this.listenBot();
    this.bettingStart();
  }

  // 監聽目前訊息
  listenBot() {
    this.bot.on("message", (msg) => {
      const chatId = `${msg.chat.id}`;

      // 只處理來自指定群組的消息
      if (chatId === config.TELEGRAM_CHAT_ID) {
        console.log(`Received a message from the group: ${msg.text}`);

        const requestBets = fastThreeParseBet(msg.text || "");

        for (let requestBet of requestBets) {
          if (!msg.from?.id) continue;
          this.bettingSystem?.placeBet(
            {
              id: `${msg.from.id}`,
              name: `${msg.from.username}`,
            },
            requestBet.betType,
            requestBet.amount
          );
        }

        this.bot.sendMessage(
          chatId,
          `你剛才說了: ${JSON.stringify(requestBets, null, 2)}`
        );
      }
    });
  }

  async bettingStart() {
    if (!this.bettingSystem) return;
    while (true) {
      this.memoryLog();
      await this.bettingSystem.start();
      await delay(30000);
      await this.bettingSystem.lockBets();
      await delay(1000);
      await this.bettingSystem.draw();
      await delay(1000);
      await this.bettingSystem.payout();
      await delay(1000);
      await this.bettingSystem.reset();
      await delay(10000);
    }
  }

  roll = async () => {
    return (await this.bot.sendDice(config.TELEGRAM_CHAT_ID)).dice?.value || 0;
  };

  notification = async (msg: string) => {
    await this.bot.sendMessage(config.TELEGRAM_CHAT_ID, msg);
  };

  notification2 = async (html: string) => {
    await this.bot.sendMessage(config.TELEGRAM_CHAT_ID, html, {
      parse_mode: "HTML",
    });
  };

  memoryLog() {
    const memoryUsage = process.memoryUsage();
    console.log("==================================================");
    console.log("Memory Usage:");
    console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
    console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
    console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
    console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
    console.log(`Array Buffers: ${memoryUsage.arrayBuffers / 1024 / 1024} MB`);
    console.log("==================================================");
  }
}
