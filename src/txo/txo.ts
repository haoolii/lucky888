// 下單機 BOT 處理
import TelegramBot from "node-telegram-bot-api";

import db from "../db";
import config from "../config";
import logger from "../core/logger";

import { upsertPlayerUserName } from "../player/service";
import { parseInputToBets } from "../bet/util";
import { playerRequestPlaceBetTx } from "./service";
import { canPlaceBetNow } from "../round/service";
import { error } from "console";
import { reply } from "../tg/tg";
import { MSG_KEY } from "../tg/key";
import { ERROR_CODES, RequestError } from "../core/error";

const bot = new TelegramBot(config.TELEGRAM_TXO_BOT_TOKEN, {
  polling: true,
});

const txo = () => {
  logger.info("TXO listing");

  bot.on("message", async (msg) => {
    const chatId = `${msg.chat.id}`;
    const messageId = `${msg.message_id}`;
    console.log(`收到消息 ${messageId}`, msg.text)
    try {

      const canPlace = await canPlaceBetNow(db)

      console.log('canPlace', canPlace)
      if (!canPlace) {
        throw new RequestError('無法下注 已封盤', ERROR_CODES.無法下注_已封盤);
      }

      // 只處理來自指定群組的消息
      if (chatId !== config.TELEGRAM_CHAT_ID) return;

      const playerId = `${msg.from?.id}`;

      const username = `${msg.from?.username}`;

      await upsertPlayerUserName(db, playerId, username)

      const requestBets = parseInputToBets(msg.text || "");

      try {
        await playerRequestPlaceBetTx(playerId, requestBets);
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, "下注成功", {
          reply_to_message_id: msg.message_id
        })
      } catch (err: any) {
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, err.message, {
          reply_to_message_id: msg.message_id
        })
      }
    } catch (err) {
      if (err instanceof RequestError){
        console.log('err', err);
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, err.message, {
          reply_to_message_id: msg.message_id
        })
      }
      console.log('err', err);
    }
  });
};

export { txo };

// const error = new Error();
// error.message