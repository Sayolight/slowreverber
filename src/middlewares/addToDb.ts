/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction } from "grammy";
import { MyContext } from "../types";

export async function addToDb(
  ctx: MyContext,
  next: NextFunction,
): Promise<void> {
  const [user] = await ctx.db.Users.upsert({
    telegram_id: ctx.from!.id,
    language_code: ctx.from?.language_code,
    username: ctx.from?.username,
    first_name: ctx.from?.first_name,
    last_name: ctx.from?.last_name,
  });

  const [settings] = await ctx.db.Settings.findOrCreate({
    where: {
      telegram_id: ctx.from!.id,
    },
  });

  ctx.settings = {
    speed: settings.speed,
    reverb: settings.reverb,
    referal: user.referal,

    async setReverb(reverb) {
      await settings.update({ reverb: reverb });
    },
    async setSpeed(speed) {
      await settings.update({ speed: speed });
    },
  };

  await next();
}
