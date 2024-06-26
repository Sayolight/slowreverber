/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MyContext } from "../types";
import { NextFunction } from "grammy";
import { logger } from "../helpers/logger";

async function logging(ctx: MyContext, next: NextFunction): Promise<void> {
  logger.debug(`new update: ${ctx.update.update_id} by: ${ctx.from?.id}`);
  if (ctx.message?.text) {
    logger.debug(
      `New text message from ${ctx.from?.first_name} ${ctx.from?.last_name} (id: ${ctx.from?.id}): ${ctx.message?.text}`,
    );
  } else if (ctx.message?.audio) {
    logger.debug(
      `New audio message from ${ctx.from?.first_name} ${ctx.from?.last_name} (id: ${ctx.from?.id}): ${ctx.message?.audio?.file_id}`,
    );
  } else if (ctx.callbackQuery) {
    logger.debug(
      `New callback_query from ${ctx.from?.first_name} ${ctx.from?.last_name} (id: ${ctx.from?.id}): ${ctx.callbackQuery?.data}`,
    );
  }
  await next();
}

export { logging };
