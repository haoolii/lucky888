import TelegramBot from "node-telegram-bot-api";
import config from "../config";
import logger from "../core/logger";

export const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

logger.info('Telegram BOT is listening');

export const diceRoll = async () => {
    return (await bot.sendDice(config.TELEGRAM_CHAT_ID)).dice?.value || 0;
};

export const broadcast = async (msg: string) => {
    try {
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, `
            <b>${msg}</b>    
        `, {
            parse_mode: 'HTML'
        })
    } catch (err) {
        logger.error('Broadcast Error');
        logger.error(err);
    }
}

