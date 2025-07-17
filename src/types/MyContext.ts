import { Context } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { FileFlavor } from "@grammyjs/files";
import { PrismaClient } from "../../prisma/generated";

interface DbFlavor {
  db: PrismaClient;
}

export interface SettingsFlavor {
  settings: {
    speed: number;
    reverb: boolean;

    setReverb: (reverb: boolean) => Promise<void>;
    setSpeed: (speed: number) => Promise<void>;
  };
}

type MyContext = I18nFlavor & FileFlavor<Context> & DbFlavor & SettingsFlavor;

export default MyContext;
