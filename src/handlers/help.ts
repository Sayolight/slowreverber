import { Composer } from "grammy";
import { MyContext } from "../types/";

export const composer = new Composer<MyContext>();
const help = composer.chatType("private");

help.command(["start", "help"], async (ctx: MyContext) => {
  const arg = ctx.message?.text?.split(" ")[1];
  if (arg?.startsWith("ORIGIN_")) {
    const file = await ctx.db.Cache.findOne({
      where: { origin_unique_id: arg.replace("ORIGIN_", "") },
    });
    if (file) {
      return await ctx.replyWithAudio(file.origin_id, {
        caption: "@slowreverberbot",
      });
    }
    return await ctx.reply(ctx.t("originNotFound"));
  } else if (!ctx.settings.referal) {
    await ctx.db.Users.update(
      { referal: arg },
      { where: { telegram_id: ctx.from?.id } },
    );
    ctx.settings.referal = arg;
  }

  await ctx.reply(ctx.t("help.text", { name: ctx?.from?.first_name ?? "" }));
});
