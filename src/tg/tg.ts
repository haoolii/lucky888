import TelegramBot from "node-telegram-bot-api";
import config from "../config";
import logger from "../core/logger";
import fs from 'fs';
import path from 'path';
import { MSG_KEY } from "./key";
import Mustache from "mustache";

export const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

logger.info('Telegram BOT is listening');

export const diceRoll = async () => {
    return (await bot.sendDice(config.TELEGRAM_CHAT_ID)).dice?.value || 0;
};

const TEMPLATE_PATH = path.join(__dirname, 'templates');

export const readTemplate = (key: MSG_KEY): string => {
    const filePath = path.join(TEMPLATE_PATH, `${key}.mustache`);
    return fs.readFileSync(filePath, 'utf-8');
};

export const reply = async (replyMessageId: string, msgKey: MSG_KEY, data?: Record<string, any>) => {
    try {
        const tpl = readTemplate(msgKey);
        const cnt = Mustache.render(tpl, data);
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, cnt, {
            reply_to_message_id: Number(replyMessageId),
            parse_mode: 'HTML'
        });
        return true;
    } catch (err) {
        console.log('reply failed', err);
    }
}

export const broadcast = async (msgKey: MSG_KEY, data?: Record<string, any>) => {
    try {
        const tpl = readTemplate(msgKey);
        const cnt = Mustache.render(tpl, data);
        await bot.sendMessage(config.TELEGRAM_CHAT_ID, cnt, {
            parse_mode: 'HTML'
        });
        return true;
    } catch (err) {
        console.log('reply failed', err);
    }
}