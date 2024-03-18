import { Model } from "sequelize";
interface SettingsAttributes {
  telegram_id: number;
  speed: number;
  reverb: boolean;
}

export default class Settings extends Model<SettingsAttributes> {
  declare telegram_id: number;
  declare speed: number;
  declare reverb: boolean;
}
