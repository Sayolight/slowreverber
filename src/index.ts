import bot from "./bot";
import { parseMode } from "@grammyjs/parse-mode";
import { hydrateFiles } from "@grammyjs/files";
import commands from "./helpers/bot-commands";
import middlewares from "./middlewares";
import handlers from "./handlers";
import { logger } from "./helpers/logger";
import { setup } from "./database";
import { audioQueue } from "./helpers/queue";

middlewares.setup(bot);
handlers.setup(bot);
commands.setup(bot);

setup();

bot.api.config.use(hydrateFiles(bot.token));
bot.api.config.use(parseMode("HTML"));

// Clear jobs and updates
audioQueue
  .getRepeatableJobs()
  .then((jobs) =>
    jobs.forEach((job) => audioQueue.removeRepeatableByKey(job.key)),
  );
fetch("https://api.telegram.org/bot" + bot.token + "/getUpdates?offset=-1");

bot.start();

logger.info("bot started");
