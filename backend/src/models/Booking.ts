import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Schedule } from "./Schedule";

export class Booking extends Model {
  public id!: number;
  public schedule_id!: number;
  public player_name!: string;
  public player_phone!: string | null;
  public player_count!: number;
  public status!: string;
  public readonly created_at!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Schedule,
        key: "id",
      },
    },
    player_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    player_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    player_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "confirmed",
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Booking.belongsTo(Schedule, { foreignKey: "schedule_id", as: "schedule" });
Schedule.hasMany(Booking, { foreignKey: "schedule_id", as: "bookings" });
