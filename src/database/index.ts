import {NextFunction} from "grammy";
import {MyContext} from "../types";
import {PrismaClient} from "../../prisma/generated";

if (process.env.DB_NAME === undefined || process.env.DB_USERNAME === undefined || process.env.DB_PASSWORD === undefined || process.env.DB_HOST === undefined) {
    throw Error("No DB provided");
}

const prisma = new PrismaClient();

export async function setup(): Promise<void> {
    await prisma.$connect();
}

export async function middleware(ctx: MyContext, next: NextFunction,): Promise<void> {
    ctx.db = prisma;
    return await next();
}
