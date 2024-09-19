import BigNumber from "bignumber.js";
import config from "../config";
import logger from "../core/logger";
import { canPlaceBetNow, placeBet } from "./oper";
import { parseInputToBets } from "./parse";
import { bot } from "./tg";

const ply = async () => {
  bot.on("message", async (msg) => {
    const chatId = `${msg.chat.id}`;
    const messageId = msg.message_id;

    // 只處理來自指定群組的消息
    if (chatId === config.TELEGRAM_CHAT_ID) {
      logger.info(`Received a message from the group: ${msg.text}`);

      const requestBets = parseInputToBets(msg.text || "");

      if (requestBets.length) {
        const can = await canPlaceBetNow();

        if (!can) {
          await bot.sendMessage(
            chatId,
            `@${msg.from?.username} 已封盤, 無法下注`,
            {
              parse_mode: "HTML",
              reply_to_message_id: messageId,
            }
          );
          return;
        }

        for (let requestBet of requestBets) {
          if (!msg.from?.id) continue;

          await placeBet(
            `${msg.from.id}`,
            requestBet.betType,
            BigNumber(requestBet.amount).toString()
          );
        }

        await bot.sendMessage(
          chatId,
          `@${msg.from?.username} 下注成功: <pre>${JSON.stringify(
            requestBets,
            null,
            2
          )}</pre>`,
          {
            parse_mode: "HTML",
            reply_to_message_id: messageId,
          }
        );
      }
    }
  });
};

export { ply };
