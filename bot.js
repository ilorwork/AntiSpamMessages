require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/./, (msg) => {
  const frases = [
    "סקס בישראל",
    "תשואה של עד 85%",
    "להשיג יותר מ-$100 ליום",
    "𝒊𝒏𝒗𝒆𝒔𝒕",
  ];
  const chatId = msg.chat.id;

  const found = frases.find((frase) => msg.text.includes(frase));
  if (!found) return;

  bot.deleteMessage(chatId, msg.message_id);
  bot.sendMessage(chatId, "Forbidden content deleted");
});
