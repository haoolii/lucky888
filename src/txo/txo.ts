// 下單機
// 下單機 BOT 處理

import TelegramBot from "node-telegram-bot-api";
import config from "../config";
import logger from "../core/logger";

const bot = new TelegramBot(config.TELEGRAM_TXO_BOT_TOKEN, {
  polling: true,
});

const txo = () => {
  logger.info("txo listing");
  bot.on("message", async (msg) => {
    console.log("msg", msg);
    await bot.sendMessage(config.TELEGRAM_CHAT_ID, "Hello Testing", {
      reply_to_message_id: msg.message_id,
    });
  });
};

export { txo };
