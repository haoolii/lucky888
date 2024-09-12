import 'dotenv/config'

import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '';

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id; // 訊息ID

    console.log(msg);
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, `Received your message @${msg.from?.username}`, { reply_to_message_id: messageId });
});
