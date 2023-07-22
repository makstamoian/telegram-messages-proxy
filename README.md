# telegram-messages-proxy

```bash
git clone https://github.com/maxtamoian/telegram-messages-proxy.git
cd telegram-messages-proxy
npm install
npm run dev
```
To properly run telegram-messages-proxy you need .env file in the root directory of repository. Your .env file must contain:

1. Telegram API Token
2. Your user id (or user id of man, to whom you want proxy messages sent to this bot)
3. Your username (or username of of man, to whom you want proxy messages sent to this bot)
   
Make sure to name all variables according to their references in index.js file

You can get your own Telegram Bot API Token here: [@BotFather](https://t.me/BotFather)
