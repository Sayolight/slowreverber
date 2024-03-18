import { Bot } from "grammy";

import { autoQuote } from "@roziscoding/grammy-autoquote";

import i18n from "./i18n";
import { logging } from "./logging";
import { ratelimiter } from "./ratelimiter";
import { MyContext } from "../types";
import { middleware as database } from "../database";
import { addToDb } from "./addToDb";

async function setup(bot: Bot<MyContext>): Promise<void> {
  bot.use(i18n);
  bot.use(logging);
  bot.use(database);
  bot.use(addToDb);
  bot.use(ratelimiter);
  bot.use(autoQuote);
}

export default { setup };
