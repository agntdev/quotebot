import { buildBot } from "./bot.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN environment variable is required");
  process.exit(1);
}

const bot = buildBot(token);
bot.start({
  onStart: (info) => {
    console.log(`QuoteBot started as @${info.username}`);
  },
});