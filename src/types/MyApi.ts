import { Api } from "grammy";
import { FileApiFlavor } from "@grammyjs/files";

type MyApi = FileApiFlavor<Api>;

export default MyApi;
