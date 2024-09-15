import TelegramBot from "node-telegram-bot-api";
import config from "./config";
import fs from 'fs';
const imagePath = 'src/tenor.gif';

const main = async () => {
    console.log('TG BOT TEST');

    const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

    await bot.sendAnimation(config.TELEGRAM_CHAT_ID, fs.createReadStream(imagePath), {
        caption: `<b>bold text</b>\n<b>bold text</b>\n<b>bold text bold text bold text bold text bold text</b>\n<i>italic text</i>`,
        parse_mode: 'HTML'
    })
}
    

main();
