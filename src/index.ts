import * as dotenv from "dotenv";
import Bot from "./bot/Bot";

dotenv.config();

const bot = new Bot(String(process.env.BOT_TOKEN));

bot.run()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
