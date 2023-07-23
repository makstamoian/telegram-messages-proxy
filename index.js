require("dotenv").config();
const TelegramBotApi = require("node-telegram-bot-api");
const redis = require("redis");
const token = process.env.TELEGRAM_API_TOKEN;
const userIdProxy = process.env.USER_ID_TO_PROXY;
const adminUsername = process.env.ADMIN_USERNAME;
console.log("Token: " + token);

const bot = new TelegramBotApi(token, { polling: true });

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("error", (err) => {
  console.log("Error " + err);
});

(async () => {
  await client.connect();
})();

let state = {};

(async () => {
  if ((await client.get("state")) === null) {
    console.log("Updating database...");
    await client.set("state", JSON.stringify(state));
    console.log("Database updated: " + (await client.get("state")));
  } else {
    console.log("Fetching database...");
    const stringedState = await client.get("state");
    state = JSON.parse(stringedState);
    console.log("Database fetched: " + state + " (" + stringedState + ")");
  }
})();

bot.on("message", async (msg) => {
  if (msg.text === "/start") {
    if (msg.from.username === adminUsername) {
      bot.sendMessage(msg.from.id, "Hello, dear administrator!");
      bot.sendMessage(msg.from.id, "Current user id to proxy: " + msg.from.id);
    } else {
      bot.sendMessage(
        msg.from.id,
        "You can send message to Administrator of this bot. Also you left fingerprint in Administrator's system of talks tracking"
      );
      state[msg.from.username] = {};
      state[msg.from.username].userid = msg.from.id;
      (async () => {
        await client.set("state", JSON.stringify(state));
      })();
    }
  } else {
    if (msg.from.username === adminUsername) {
      if (msg.text[0] !== "/" && msg.text[0] === "@") {
        const data = msg.text;
        const atsign = data.indexOf("@");
        const space = data.indexOf(" ");
        const username = data.substring(atsign + 1, space);
        if (username in state) {
          const userid = state[username].userid;
          bot.sendMessage(userid, data);
        } else if (username === "all") {
          for (let user in state) {
            bot.sendMessage(state[user].userid, data);
            console.log("Sent to " + user);
          }
        } else {
          bot.sendMessage(userIdProxy, "No such user in database");
        }
      }
    } else {
      if (msg.text) {
        bot.sendMessage(userIdProxy, msg.text + " (" + msg.from.username + ")");
      }
      if (msg.audio) {
        bot.sendMessage(userIdProxy, " (" + msg.from.username + ")");
        bot.sendAudio(userIdProxy, msg.audio);
      }
      if (msg.photo) {
        bot.sendMessage(userIdProxy, " (" + msg.from.username + ")");
        bot.sendPhoto(userIdProxy, msg.photo);
      }
      if (msg.location) {
        bot.sendMessage(userIdProxy, " (" + msg.from.username + ")");
        bot.sendLocation(userIdProxy, msg.location);
      }
      if (msg.document) {
        bot.sendMessage(userIdProxy, " (" + msg.from.username + ")");
        bot.sendDocument(userIdProxy, msg.document);
      }
    }
  }

  if (msg.text === "/listusers" && msg.from.username === adminUsername) {
    bot.sendMessage(msg.from.id, "Fetching database...");
    (async () => {
      const listUsers = JSON.parse(await client.get("state"));
      bot.sendMessage(msg.from.id, JSON.stringify(listUsers, null, 4));
    })();
  }
});

bot.on("polling_error", console.log);
