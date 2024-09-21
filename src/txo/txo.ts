// 下單機
// 下單機 BOT 處理

import TelegramBot from "node-telegram-bot-api";
import config from "../config";
import logger from "../core/logger";
import { checkIsPlayerExist, createPlayer, getPlayer } from "../player/player.service";
import db from "../db";
import { parseInputToBets } from "../bet/parser";
import { PlayerRequestBet } from "./type";
import { playerRequestPlaceBetTx } from "./txo.service";
import { bot, reply } from "../tg/tg";
import { MSG_KEY } from "../tg/key";

// const bot = new TelegramBot(config.TELEGRAM_TXO_BOT_TOKEN, {
//   polling: true,
// });

const txo = () => {
  logger.info("TXO listing");

  bot.on("message", async (msg) => {
    const chatId = `${msg.chat.id}`;

    const messageId = `${msg.message_id}`;

    // 只處理來自指定群組的消息
    if (chatId !== config.TELEGRAM_CHAT_ID) return;

    const playerId = `${msg.from?.id}`;

    await db.$transaction(async (tx) => {

      const exist = await checkIsPlayerExist(tx, playerId);

      if (!exist) {
        await createPlayer(tx, playerId);
      }

    })

    const requestBets = parseInputToBets(msg.text || "");

    try {
      await playerRequestPlaceBetTx(playerId, requestBets);
    } catch (err) {
      console.log('errr', err);
      // logger.error(JSON.stringify(err, null, 2));
      // bot.sendMessage(config.TELEGRAM_CHAT_ID, err.toString(), {
      //   reply_to_message_id: msg.message_id
      // })
    }

    // await reply(messageId, MSG_KEY.PLAYER_BET_SUCCESS, {
    //   id: msg.from?.id,
    //   username: msg.from?.username,
    //   bets: requestBets
    // })

  });
};

export { txo };
