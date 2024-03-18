import { Bot } from "grammy";
import { MyContext } from "../types";
import { logger } from "./logger";
import i18n from "../middlewares/i18n";

async function setup(bot: Bot<MyContext>): Promise<void> {
  i18n.locales.forEach(async (locale: string): Promise<void> => {
    try {
      await bot.api.setMyCommands(
        [
          { command: "start", description: i18n.t(locale, "bot.start") },
          { command: "help", description: i18n.t(locale, "bot.help") },
          { command: "settings", description: i18n.t(locale, "bot.settings") },
        ],
        { language_code: locale },
      );

      await bot.api.setMyDescription(i18n.t(locale, "bot.description"), {
        language_code: locale,
      });
      await bot.api.setMyShortDescription(i18n.t(locale, "bot.about"), {
        language_code: locale,
      });
    } catch (e) {
      logger.error(e);
    }
  });
}

export default { setup };
