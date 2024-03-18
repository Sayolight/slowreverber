import { Composer } from "grammy";
import { MyContext } from "../types/";
import settings_menu from "../keyboards/settings";

export const composer = new Composer<MyContext>();
const settings = composer.chatType("private");

settings.use(settings_menu);
settings.command(["settings"], async (ctx: MyContext) => {
  await ctx.reply(ctx.t("settings.text"), { reply_markup: settings_menu });
});
