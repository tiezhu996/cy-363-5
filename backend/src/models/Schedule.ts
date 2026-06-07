import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Theme } from "./Theme";

export class Schedule extends Model {
  public id!: number;
  public theme_id!: number;
  public schedule_date!: string;
  public start_time!: string;
  public end_time!: string;
  public max_players!: number;
  public is_locked!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Schedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Theme,
        key: "id",
      },
    },
    schedule_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "schedules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["theme_id", "schedule_date", "start_time"],
      },
    ],
  }
);

Schedule.belongsTo(Theme, { foreignKey: "theme_id", as: "theme" });
Theme.hasMany(Schedule, { foreignKey: "theme_id", as: "schedules" });
