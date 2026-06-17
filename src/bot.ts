import { Bot } from "grammy";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const QUOTES: string[] = [
  "The only way to do great work is to love what you do. \u2014 Steve Jobs",
  "Life is what happens when you're busy making other plans. \u2014 John Lennon",
  "Do not wait to strike till the iron is hot; but make it hot by striking. \u2014 William Butler Yeats",
  "Whether you think you can or you think you can\u2019t, you\u2019re right. \u2014 Henry Ford",
  "The future belongs to those who believe in the beauty of their dreams. \u2014 Eleanor Roosevelt",
  "It does not matter how slowly you go so long as you do not stop. \u2014 Confucius",
  "You miss 100% of the shots you don\u2019t take. \u2014 Wayne Gretzky",
  "Believe you can and you\u2019re halfway there. \u2014 Theodore Roosevelt",
  "Act as if what you do makes a difference. It does. \u2014 William James",
  "Be the change that you wish to see in the world. \u2014 Mahatma Gandhi",
];

const COUNTER_FILE = join("data", "counter.json");

function readCounter(): number {
  try {
    if (!existsSync(COUNTER_FILE)) return 0;
    const raw = readFileSync(COUNTER_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed.value === "number" ? parsed.value : 0;
  } catch {
    return 0;
  }
}

function writeCounter(value: number): void {
  mkdirSync("data", { recursive: true });
  writeFileSync(COUNTER_FILE, JSON.stringify({ value }), "utf-8");
}

function incrementCounter(): number {
  const next = readCounter() + 1;
  writeCounter(next);
  return next;
}

function pickQuote(): string {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index];
}

export function buildBot(token: string): Bot {
  const bot = new Bot(token);

  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Hello! I'm QuoteBot. Send /quote for an inspirational quote or /count to see how many quotes I've served.",
    );
  });

  bot.command("quote", async (ctx) => {
    const quote = pickQuote();
    incrementCounter();
    await ctx.reply(quote);
  });

  bot.command("count", async (ctx) => {
    const served = readCounter();
    await ctx.reply(`Quotes served since launch: ${served}`);
  });

  return bot;
}