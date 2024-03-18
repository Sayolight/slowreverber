import { NextFunction } from "grammy";
import { DataTypes, Sequelize } from "sequelize";
import { MyContext } from "../types";
import User from "./models/users";
import Settings from "./models/settings";
import Cache from "./models/cache";

if (
  process.env.DB_NAME === undefined ||
  process.env.DB_USERNAME === undefined ||
  process.env.DB_PASSWORD === undefined ||
  process.env.DB_HOST === undefined
) {
  throw Error("No DB provided");
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    logging: process.env.log === "debug",
  },
);

User.init(
  {
    telegram_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    language_code: DataTypes.STRING,
    referal: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "users",
  },
);

Settings.init(
  {
    telegram_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    speed: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.7,
    },
    reverb: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "settings",
  },
);

Cache.init(
  {
    telegram_id: {
      type: DataTypes.BIGINT,
      primaryKey: false,
    },
    speed: DataTypes.DOUBLE,
    reverb: DataTypes.BOOLEAN,
    origin_unique_id: DataTypes.STRING,
    origin_id: DataTypes.STRING,
    remix_id: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "cache",
  },
);

export async function setup(): Promise<void> {
  await sequelize.sync();
}

export async function middleware(
  ctx: MyContext,
  next: NextFunction,
): Promise<void> {
  ctx.db = {
    Users: User,
    Settings: Settings,
    Cache: Cache,
  };

  return await next();
}
