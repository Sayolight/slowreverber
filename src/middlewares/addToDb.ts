/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {NextFunction} from "grammy";
import {MyContext} from "../types";

export async function addToDb(
    ctx: MyContext,
    next: NextFunction,
): Promise<void> {
    if (!ctx.from) return;

    const arg = ctx.message?.text?.split(" ")[1];
    const referal = arg?.startsWith("ORIGIN_") ? undefined : arg;

    const user = await ctx.db.user.upsert({
        where: {
            telegram_id: ctx.from.id
        },
        update: {
            language_code: ctx.from.language_code,
            username: ctx.from.username,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
        },
        create: {
            telegram_id: ctx.from.id,
            language_code: ctx.from.language_code,
            username: ctx.from.username,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            referal: referal
        }
    })

    const settings = await ctx.db.settings.upsert(
        {
            where: {
                telegram_id: ctx.from.id
            },
            update: {},
            create: {
                telegram_id: ctx.from.id,
                reverb: true,
                speed: 0.7,
            }
        }
    )

    const updateSettings = async (data: any) => {
        if (!ctx.from) return;
        await ctx.db.settings.update({
            where: {telegram_id: ctx.from.id},
            data
        })
    }

    ctx.settings = {
        speed: settings.speed,
        reverb: settings.reverb,

        setSpeed: async function (speed: number) {
            await updateSettings({speed});
            this.speed = speed;
        },

        setReverb: async function (reverb: boolean) {
            await updateSettings({reverb});
            this.reverb = reverb;
        },
    }

    await next();
}
