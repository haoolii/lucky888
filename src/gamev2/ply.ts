import BigNumber from "bignumber.js";
import config from "../config";
import logger from "../core/logger";
import { canPlaceBetNow, createUserInfo, getPlayerInfo, placeBet } from "./oper";
import { parseInputToBets } from "./parse";
import { bot, reply } from "../tg/tg";
import { MSG_KEY } from "../tg/key";

const ply = async () => {
    bot.on("message", async (msg) => {
        const chatId = `${msg.chat.id}`;
        const messageId = `${msg.message_id}`;

        // 只處理來自指定群組的消息
        if (chatId !== config.TELEGRAM_CHAT_ID) return;

        logger.info(`Received a message from the group: ${msg.text}`);

        const requestBets = parseInputToBets(msg.text || "");

        if (requestBets.length) {
            const can = await canPlaceBetNow();

            if (!can) {
                await reply(messageId, MSG_KEY.PLAYER_BET_REJECTED, {
                    username: msg.from?.username,
                })

                return;
            }

            const playerId = `${msg.from?.id}`;

            let playerInfo = await getPlayerInfo(playerId);

            if (!playerInfo) {
                playerInfo = await createUserInfo(playerId);
            }

            playerInfo = await getPlayerInfo(playerId);

            if (!playerInfo) {
                await reply(messageId, MSG_KEY.DEFAULT_MESSAGE, {
                    message: '用戶異常'
                });
                return;
            }

            // TODO: 可能需要優化
            const availableBalanceBigNum = BigNumber(playerInfo.balance).minus(playerInfo.lockedBalance);

            let totalBigNum = BigNumber(0);
            for (let requestBet of requestBets) {
                totalBigNum.plus(requestBet.amount);
            }
            logger.info(`totalBigNum, ${totalBigNum.toString()}`)
            logger.info(`availableBalanceBigNum, ${availableBalanceBigNum.toString()}`)

            // 超過可使用餘額
            if (totalBigNum.isGreaterThan(availableBalanceBigNum) || availableBalanceBigNum.isLessThan(1)) {
                await reply(messageId, MSG_KEY.DEFAULT_MESSAGE, {
                    message: `餘額不足 可用餘額:${availableBalanceBigNum.toString()}`
                });
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

            await reply(messageId, MSG_KEY.PLAYER_BET_SUCCESS, {
                id: msg.from?.id,
                username: msg.from?.username,
                bets: requestBets
            })
        }
    });
};

export { ply };
