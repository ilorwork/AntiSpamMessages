require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Set up Express server
const url = process.env.BASE_URL;
const port = 3000; // You can choose any available port

const myChatId = process.env.MY_CHAT_ID;

// Create an instance of your Telegram bot
const token = process.env.BOT_API;
const bot = new TelegramBot(token);

// Set up your Webhook URL (publicly accessible server URL with a unique path)
const webhookPath = process.env.WEBHOOK_PATH;
const webhookURL = `${url}${webhookPath}`;
// Render URL
// const webhookURL = `https://antispammessages.onrender.com${webhookPath}`;

// For testing on localhost with an open to the wide internet connection I use ngrok:
// const webhookURL = `equally-included-zebra.ngrok-free.app${webhookPath}`;
// my ngrok dashboard - https://dashboard.ngrok.com/cloud-edge/domains
// Tunnel command:
// ngrok http --domain=equally-included-zebra.ngrok-free.app 3000

// Set the Webhook
bot.setWebHook(webhookURL);

// Use body-parser to parse JSON requests
app.use(bodyParser.json());

// Create an endpoint for the Webhook
app.post(webhookPath, (req, res) => {
  try {
    const msg = req.body;
    // Handle incoming updates (messages) from Telegram here
    // Your existing bot code for processing messages can go here
    const frases = [
      "𝒊𝒏𝒗еѕт",
      "Making money online",
      "making money online",
      "Guys, write, let's talk)",
      "Ребята, пишите, поговорим)",
      "Hello boys:)",
      "Shall we talk?)",
      "Hi, everybody:)",
      "Hi, I want to chat.",
    ];

    console.log("################################# test");
    // This line causes an error, enable when debugging failure situation is needed.
    // bot.sendMessage(myChatId, `Forbidden content`, msg.message.text);

    const chatId = msg.message.chat.id;
    console.log("chat id: ", chatId, "text: ", msg.message.text);

    const found = frases.find((frase) => msg.message.text.includes(frase));
    console.log("Is forbidden content: ", !!found);
    if (!found) return;

    bot.deleteMessage(chatId, msg.message.message_id);
    bot.sendMessage(chatId, "Forbidden content deleted");
    console.log(
      `Forbidden content deleted in chat: ${chatId}, content: ${msg.message.text}`
    );
    console.info("Full message object: ", msg);
    res.status(200).send("OK");
  } catch (error) {
    // Handle the case where the received data is not a valid message or any other error
    console.error("An error has occure", error);
    bot.sendMessage(myChatId, `An error has occure ${error}`);
    bot.sendMessage(
      myChatId,
      `msg details ${JSON.stringify(req.body.message)}`
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
