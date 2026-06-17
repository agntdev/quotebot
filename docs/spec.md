## Summary
A tiny Telegram bot that greets users, serves a random inspirational quote from a fixed built-in list of 10 quotes, and reports how many quotes have been served since the bot was first launched. No external APIs, single responsibility, minimal surface area.

## Audience
Telegram users who want a quick inspirational quote. No admin UX or multi-tenant features required.

## Core entities
- Quote (built-in list of 10 strings embedded in the code)
- Global counter (number of quotes served since launch, persisted)

## Integrations & notification targets
- Telegram Bot API only. No external services or notifications.
- Bot token provided via environment variable TELEGRAM_BOT_TOKEN.

## Interaction flows
1. /start
   - Behavior: send a warm greeting and a short hint about available commands.
   - Exact message: "Hello! I'm QuoteBot. Send /quote for an inspirational quote or /count to see how many quotes I've served."
2. /quote
   - Behavior: atomically increment the global counter in storage, pick one quote at random from the built-in list, and send it as plain text.
   - Random selection: use a single random.choice from the in-memory list.
   - Example response: a single-quote text message containing the selected quote.
3. /count
   - Behavior: read the persisted global counter and reply with plain text, e.g. "Quotes served since launch: 42".
4. Bot will register the three commands with Telegram at startup: /start, /quote, /count.

## Persistence
- Use a local SQLite database file (./data/quotes.db).
- Schema: one table named "counter" with columns (name TEXT PRIMARY KEY, value INTEGER).
  - At startup, ensure row ('quotes_served', N) exists (default 0).
- Rationale: durable across restarts, no external infra, simple transactions for increments.
- Implementation notes: use a single connection with short transactions; increment using "UPDATE counter SET value = value + 1 WHERE name = 'quotes_served'" inside a transaction, then SELECT the value if needed.

## Payments
- None.

## Non-goals
- No user-specific counters or per-user storage.
- No admin panel, no analytics, no external monitoring.
- No webhooks or multi-instance clustering (default uses long polling).
- No external quote sources or APIs.

## Built-in quotes (the exact 10 strings to embed)
1. "The only way to do great work is to love what you do. — Steve Jobs"
2. "Life is what happens when you're busy making other plans. — John Lennon"
3. "Do not wait to strike till the iron is hot; but make it hot by striking. — William Butler Yeats"
4. "Whether you think you can or you think you can’t, you’re right. — Henry Ford"
5. "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt"
6. "It does not matter how slowly you go so long as you do not stop. — Confucius"
7. "You miss 100% of the shots you don’t take. — Wayne Gretzky"
8. "Believe you can and you’re halfway there. — Theodore Roosevelt"
9. "Act as if what you do makes a difference. It does. — William James"
10. "Be the change that you wish to see in the world. — Mahatma Gandhi"

## Implementation notes for the builder (concrete)
- Language: Python 3.10+.
- Library: python-telegram-bot (v20+, async) using long polling (Application.run_polling()).
- Env: TELEGRAM_BOT_TOKEN for the token.
- Data file: create directory ./data and file ./data/quotes.db.
- DB table creation SQL:
  CREATE TABLE IF NOT EXISTS counter (name TEXT PRIMARY KEY, value INTEGER NOT NULL);
  INSERT OR IGNORE INTO counter(name, value) VALUES('quotes_served', 0);
- Increment sequence (atomic): BEGIN; UPDATE counter SET value = value + 1 WHERE name = 'quotes_served'; COMMIT; then SELECT value FROM counter WHERE name = 'quotes_served';
- Logging: simple console logs (INFO).
- Message formatting: plain text (no Markdown).
- Commands to register: [{"command": "start", "description": "Greet"}, {"command": "quote", "description": "Get an inspirational quote"}, {"command": "count", "description": "How many quotes served"}].

## Assumptions & defaults
- Persistence: SQLite file at ./data/quotes.db — simple, durable, zero external services.
  Rationale: keeps the project self-contained and persistent across restarts.
- Bot runs with long polling (no webhook) on a single instance.
  Rationale: simplest deploy and local development without public HTTPS.
- Counter scope is global (counts quotes served across all users and chats).
  Rationale: aligns with the owner's description "how many quotes have been served since launch".
- Language & stack: Python 3.10+ with python-telegram-bot v20+.
  Rationale: widely used, minimal boilerplate, async-friendly.
- Token delivery: TELEGRAM_BOT_TOKEN provided via environment variable.
  Rationale: standard secret management for small bots.
- Quotes are fixed and embedded in code; no external updates or admin edit facility.
  Rationale: requirement: fixed built-in list of 10 quotes.

If you want any of the assumptions changed (e.g., use webhooks, a different DB, or include admin/editing), tell me which one to change and I will adjust the brief.