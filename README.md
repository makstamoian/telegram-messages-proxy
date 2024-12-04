# telegram-messages-proxy

```bash
git clone https://github.com/maxtamoian/telegram-messages-proxy.git
cd telegram-messages-proxy
npm install
npm run dev
```
To properly run telegram-messages-proxy you need an .env file in the root directory of the repository. Your .env file must contain:

1. A Telegram API Token
2. Your user id (or user id of an account, to whom you want to proxy the messages sent to this bot)
3. Your username (or username of an account, to whom you want to proxy the messages sent to this bot)
   
Make sure to name all variables according to their references in index.js file

You can get your own Telegram Bot API Token here: [@BotFather](https://t.me/BotFather)
