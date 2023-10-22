require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const forbiddenPhrases = require("./phrases.json");
const app = express();

// Set up Express server
const url = process.env.BASE_URL;
const port = process.env.PORT; // You can choose any available port

const myChatId = process.env.MY_CHAT_ID;

// Create an instance of your Telegram bot
const token = process.env.BOT_API;
const bot = new TelegramBot(token);

// Set up your Webhook URL (publicly accessible server URL with a unique path)
const webhookPath = process.env.WEBHOOK_PATH;
const webhookURL = `${url}${webhookPath}`;

// For testing on localhost with an open to the wide internet connection I use ngrok:
// my ngrok dashboard - https://dashboard.ngrok.com/cloud-edge/domains
// Tunnel command:
// ngrok http --domain=equally-included-zebra.ngrok-free.app 3000

// Set the Webhook
bot.setWebHook(webhookURL);

// Use body-parser to parse JSON requests
app.use(bodyParser.json());

// Define a function to handle incoming messages
const handleIncomingMessage = async (msg) => {
  console.log("################################# Incoming Message");
  // This line causes an error, enable when debugging failure situation is needed.
  // bot.sendMessage(myChatId, `Forbidden content`, msg.message.text);

  const chatId = msg.message.chat.id;
  console.log("chat id: ", chatId, "text: ", msg.message.text);

  const found = forbiddenPhrases.find((phrase) =>
    msg.message.text.includes(phrase)
  );
  console.log("Is forbidden content: ", !!found);
  if (!found) return;

  await bot.deleteMessage(chatId, msg.message.message_id);
  await bot.sendMessage(chatId, "Forbidden content deleted");
  console.log(
    `Forbidden content deleted in chat: ${chatId}, content: ${msg.message.text}`
  );
  console.info("Full message object: ", msg);
};

// Create an endpoint for the Webhook
app.post(webhookPath, async (req, res) => {
  try {
    const msg = req.body;
    await handleIncomingMessage(msg);
    res.status(200).send("OK");
  } catch (error) {
    // Handle errors and notify the admin
    console.error("An error has occurred", error);
    await bot.sendMessage(myChatId, `An error has occurred: ${error}`);
    await bot.sendMessage(
      myChatId,
      `Message details ${JSON.stringify(req.body.message)}`
    );
    res.status(200).send("OK");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(
    `Bot is listening on port ${port}, https://t.me/AntiSpamMessagesBot`
  );
});
