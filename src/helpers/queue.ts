import { Audio } from "@grammyjs/types";
import Queue from "bull";
import { exec } from "child_process";
import path, { parse } from "path";
import { promisify } from "util";
import bot from "../bot";
import { logger } from "./logger";
import { processAudio } from "./reverber";

const execAsync = promisify(exec);

if (
  process.env.REDIS_PORT === undefined ||
  process.env.REDIS_HOST === undefined ||
  process.env.REDIS_PASS === undefined
) {
  throw Error("No REDIS provided");
}

export const audioQueue = new Queue("audio processing", {
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS,
  },
  defaultJobOptions: {
    attempts: 1,
    timeout: 30000,
    removeOnComplete: true,
    removeOnFail: true,
  },
});
audioQueue.clean(0);

interface dataI {
  audio: Audio;
  message_id: number;
  user_id: number;
  speed: number;
  reverb: boolean;
}
const defaultCoverPath = path.join(__dirname, "/../../public/cover.jpg");

audioQueue
  .process(async function (job, done): Promise<void> {
    const data: dataI = job.data;
    const audioPath = path.join(
      __dirname,
      "/../../public/tmp/",
      data.audio.file_id,
      "/",
    );

    try {
      await execAsync("mkdir " + audioPath);
      logger.debug("Downloading file...");

      const file = await bot.api.getFile(data.audio.file_id);
      const path = await file.download(
        audioPath +
          data.user_id +
          data.message_id +
          " " +
          data.audio.file_name?.replace(/[^a-zA-Z а-яА-Я 0-9 .]/g, ""),
      );

      const thumbnail = data.audio.thumb
        ? await (
            await bot.api.getFile(data.audio?.thumb?.file_id)
          ).download(audioPath + "thumbnail")
        : defaultCoverPath;

      const remixAudio = await processAudio(
        path,
        data.speed,
        data.reverb ? 50 : 0,
      );

      done(null, {
        audio: remixAudio,
        thumbnail: thumbnail,
        file: file,
        audioPath: audioPath,
      });
    } catch (e) {
      logger.error(e);
      // bot.api
      // 	.editMessageText(data.user_id, data.status_message, data.error_text)
      // 	.catch((e) => logger.error(e));
      await execAsync("rm -rf " + audioPath);
      done();
    }
  })
  .catch((e) => {
    logger.error(e);
  });
