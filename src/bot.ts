import { Bot } from "grammy";
import { MyContext, MyApi } from "./types";
import dotenv from "dotenv";
dotenv.config();

export default new Bot<MyContext, MyApi>(process.env.BOT_TOKEN ?? "");
