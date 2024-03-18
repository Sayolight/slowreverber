import { Model } from "sequelize";
interface UserAttributes {
  telegram_id: number;
  language_code?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  referal?: string;
}

export default class User extends Model<UserAttributes> {
  declare telegram_id: number;
  declare language_code?: string;
  declare username?: string;
  declare first_name?: string;
  declare last_name?: string;
  declare referal?: string;
}
