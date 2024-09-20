import "dotenv/config";

const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_TXO_BOT_TOKEN: process.env.TELEGRAM_TXO_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '-4550812437'
}

export default config;