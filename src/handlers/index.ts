import { Bot } from "grammy";
import { MyContext } from "../types";

import { composer as helpMessageHandler } from "./help";
import { composer as audioMessageHandler } from "./audio";
import { composer as settingsMessageHandler } from "./settings";
import { errorHandler } from "./error";

async function setup(bot: Bot<MyContext>): Promise<void> {
  bot.use(helpMessageHandler);
  bot.use(audioMessageHandler);
  bot.use(settingsMessageHandler);

  bot.catch(errorHandler);
}

export default { setup };
