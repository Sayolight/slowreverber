import { Model } from "sequelize";
interface CacheAttributes {
  telegram_id: number;
  speed: number;
  reverb: boolean;
  origin_unique_id: string;
  origin_id: string;
  remix_id: string;
}

export default class Cache extends Model<CacheAttributes> {
  declare telegram_id: number;
  declare speed: number;
  declare reverb: boolean;
  declare origin_unique_id: string;
  declare origin_id: string;
  declare remix_id: string;
}
