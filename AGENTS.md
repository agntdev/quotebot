# QuoteBot — Agent Instructions

## Build Commands
- Install: `npm ci`
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Start: `npm start`

## Architecture
- `src/bot.ts`: `buildBot()` factory — creates and configures the grammY Bot
- `src/index.ts`: Entry point — reads env, calls `buildBot()`, starts polling
- `src/harness-entry.ts`: Harness entry — exports `buildBot` for test harnesses

## Conventions
- TypeScript with ES modules (NodeNext)
- Bot token from `TELEGRAM_BOT_TOKEN` env var
- No external APIs beyond Telegram Bot API
- All handlers registered inside `buildBot()`