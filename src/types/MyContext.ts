import { Context } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { FileFlavor } from "@grammyjs/files";

import { ModelStatic } from "sequelize";
import User from "../database/models/users";
import Settings from "../database/models/settings";
import Cache from "../database/models/cache";

interface DbFlavor {
  db: {
    Users: ModelStatic<User>;
    Settings: ModelStatic<Settings>;
    Cache: ModelStatic<Cache>;
  };
}

interface SettingsFlavor {
  settings: {
    speed: number;
    reverb: boolean;
    referal: string | undefined;

    setReverb: (reverb: boolean) => Promise<void>;
    setSpeed: (speed: number) => Promise<void>;
  };
}

type MyContext = I18nFlavor & FileFlavor<Context> & DbFlavor & SettingsFlavor;

export default MyContext;
