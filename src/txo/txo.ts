// 下單機 BOT 處理

import TelegramBot from "node-telegram-bot-api";
import config from "../config";
import logger from "../core/logger";
import { checkIsPlayerExist, upsertPlayerUserName, createPlayer, getPlayer } from "../player/service";
import db from "../db";
import { parseInputToBets } from "../bet/util";
import { playerRequestPlaceBetTx } from "./service";

const bot = new TelegramBot(config.TELEGRAM_TXO_BOT_TOKEN, {
  polling: true,
});

const txo = () => {
  logger.info("TXO listing");

  bot.on("message", async (msg) => {
    const chatId = `${msg.chat.id}`;

    const messageId = `${msg.message_id}`;

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

    // await reply(messageId, MSG_KEY.PLAYER_BET_SUCCESS, {
    //   id: msg.from?.id,
    //   username: msg.from?.username,
    //   bets: requestBets
    // })

  });
};

export { txo };
