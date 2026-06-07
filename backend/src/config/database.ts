import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(
  env.dbName,
  env.dbUser,
  env.dbPassword,
  {
    host: env.dbHost,
    port: env.dbPort,
    dialect: "mysql",
    timezone: "+08:00",
    logging: false,
  }
);

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}
