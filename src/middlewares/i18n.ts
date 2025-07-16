import { I18n } from "@grammyjs/i18n";
import { MyContext } from "../types";
import path from "path";

const i18n = new I18n<MyContext>({
    defaultLocale: "en",
    directory: path.join(__dirname, "../../", "locales"),
});

export default i18n;
