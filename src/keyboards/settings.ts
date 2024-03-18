import { Menu } from "@grammyjs/menu";
import { MyContext } from "../types";

// Speed submenu
const speedList: number[] = [0.5, 1.1, 0.6, 1.2, 0.7, 1.3, 0.8, 1.4, 0.9, 1.5];
const settingsSpeed = new Menu<MyContext>("settings-speed").dynamic(
  (ctx, range) => {
    speedList.forEach((speed: number) => {
      range.text(
        `${ctx.settings.speed === speed ? "✅" : ""} ${speed}`,
        async (ctx: MyContext) => await updateSpeed(ctx, speed),
      );

      if (speed > 1) range.row();
    });
  },
);
settingsSpeed.back((ctx) => ctx.t("settings.back"));

// Main settings menu
const settingsMenu = new Menu<MyContext>("settings-menu")
  .submenu(
    async (ctx: MyContext) =>
      ctx.t("settings.buttons_speed", {
        speed: ctx.settings.speed.toLocaleString(),
      }),
    "settings-speed",
  )
  .row()
  .text(
    async (ctx: MyContext) =>
      ctx.t("settings.buttons_reverb", {
        reverb: ctx.settings.reverb ? "✅" : "❌",
      }),
    async (ctx: MyContext) => await updateReverb(ctx),
  )
  .row();
settingsMenu.register(settingsSpeed);

async function updateReverb(ctx: MyContext): Promise<void> {
  await ctx.db.Settings.update(
    { reverb: !ctx.settings.reverb },
    { where: { telegram_id: ctx?.from?.id } },
  );
  ctx.settings.reverb = !ctx.settings.reverb;
  await ctx.editMessageText(ctx.t("settings.text"));
}

async function updateSpeed(ctx: MyContext, speed: number): Promise<void> {
  await ctx.db.Settings.update(
    { speed: speed },
    { where: { telegram_id: ctx?.from?.id } },
  );
  if (ctx.settings.speed !== speed) {
    ctx.settings.speed = speed;
    await ctx.editMessageText(ctx.t("settings.text"));
  }
}

export default settingsMenu;
