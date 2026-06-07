import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Theme extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public difficulty!: number;
  public suggested_players!: number;
  public duration!: number;
  public description!: string;
  public poster_url!: string | null;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Theme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    suggested_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    poster_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "themes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
