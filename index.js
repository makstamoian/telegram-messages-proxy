require("dotenv").config();
const TelegramBotApi = require("node-telegram-bot-api");
const fs = require("fs/promises");
const token = process.env.TELEGRAM_API_TOKEN;
const userIdProxy = process.env.USER_ID_TO_PROXY;
const adminUsername = process.env.ADMIN_USERNAME;
console.log("Token: " + token);

const bot = new TelegramBotApi(token, { polling: true });

let state = {};

bot.on("message", async (msg) => {
  if (msg.text === "/start") {
    if (msg.from.username === adminUsername) {
      bot.sendMessage(msg.from.id, "Hello, dear administrator!");
      bot.sendMessage(msg.from.id, "Current user id to proxy: " + msg.from.id);
    } else {
      bot.sendMessage(
        msg.from.id,
        "You can send message to administrator of this bot (Age Of Conan username: Choopo). Also you left fingerprint in Choopo's system of talks tracking"
      );
      state[msg.from.username] = {};
      state[msg.from.username].userid = msg.from.id;
    }
  } else {
    if (msg.from.username === adminUsername) {
      if (msg.text[0] !== "/" && msg.text[0] === "@") {
        bot.sendMessage(userIdProxy, "Got @");
        const data = msg.text;
        const atsign = data.indexOf("@");
        const space = data.indexOf(" ");
        const username = data.substring(atsign + 1, space);
        if (username in state) {
          const userid = state[username].userid;
          bot.sendMessage(userid, data);
        } else {
          bot.sendMessage(userIdProxy, "No such user in database");
        }
      }
    } else {
      bot.sendMessage(userIdProxy, msg.text);
    }
  }

  if (msg.text === "/listusers" && msg.from.username === adminUsername) {
    const json = JSON.stringify(state);
    bot.sendMessage(msg.from.id, json);
  }
});

bot.on("polling_error", console.log);
