import { Composer, InputFile } from "grammy";
import { MyContext } from "../types/";
import { audioQueue } from "../helpers/queue";
import bot from "../bot";
import { parse } from "path";
import Cache from "../database/models/cache";
import { promisify } from "util";
import { exec } from "child_process";
import { logger } from "../helpers/logger";

export const composer = new Composer<MyContext>();
const audio = composer.chatType("private");

const execAsync = promisify(exec);
audio.on([":audio", "edited_message"], async (ctx: MyContext) => {
  const botUsername = (await bot.api.getMe()).username;
  const usersInQueue = (await audioQueue.getWaiting()).map(
    (item) => item.data.user_id,
  );

  if (ctx.message?.audio?.file_size! > 20971520) {
    return await ctx.reply(ctx.t("error.size"));
  }

  if (usersInQueue.includes(ctx.from?.id)) {
    return await ctx.reply(ctx.t("alreadyInQueue"));
  }

  const statusMessage = await ctx.reply(ctx.t("queue"));
  let res: { audioPath: string };
  const job = await audioQueue.add({
    audio: ctx.message?.audio,
    message_id: ctx.message?.message_id,
    user_id: ctx.from?.id,
    speed: ctx.settings.speed,
    reverb: ctx.settings.reverb,

    status_message: statusMessage.message_id,
    processing_text: ctx.t("processing"),
    error_text: ctx.t("error.reverb"),
  });

  await bot.api.editMessageText(
    ctx.chat!.id,
    statusMessage.message_id,
    ctx.t("processing"),
  );

  job
    .finished()
    .then(async (result) => {
      res = result;
      const audio = ctx.message?.audio;
      const audioResult = result.audio;
      const thumbnail = result.thumbnail;
      const file = result.file;
      const naming =
        " (" +
        (ctx.settings.speed > 1 ? "speed up" : "slowed") +
        (ctx.settings.reverb ? " + reverb" : "") +
        ")";

      const reply = await ctx.replyWithAudio(new InputFile(audioResult), {
        title: audio?.title
          ? audio.title + naming
          : parse(audioResult).name + naming,
        performer: audio?.performer,
        reply_to_message_id: ctx.message?.message_id,
        thumbnail: new InputFile(thumbnail),
      });
      await bot.api.editMessageCaption(ctx.chat!.id, reply.message_id, {
        caption: `@${botUsername} | <a href="https://t.me/${botUsername}?start=ORIGIN_${file.file_unique_id}">origin</a>`,
      });
      await bot.api.deleteMessage(ctx.chat!.id, statusMessage.message_id);

      await Cache.create({
        telegram_id: ctx.chat!.id,
        origin_id: file.file_id,
        origin_unique_id: file.file_unique_id,
        remix_id: reply.audio.file_id,
        speed: ctx.settings.speed,
        reverb: ctx.settings.reverb,
      });

      await execAsync("rm -rf " + result?.audioPath).catch((e) =>
        logger.error(e),
      );
    })
    .catch((err) => {
      console.log(err.code);
      execAsync("rm -rf ./public/tmp/*").catch((e) => logger.error(e));
      if (err.name === "BullJobTimeoutError") {
        console.log(
          "Задача была отменена из-за превышения времени выполнения.",
        );
      } else {
        bot.api
          .editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            ctx.t("error.reverb"),
          )
          .catch((e) => logger.error(e));
      }
    });
});
