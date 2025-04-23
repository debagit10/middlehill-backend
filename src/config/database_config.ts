import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = String(process.env.DB_URL_DEV);

if (!dbUrl) {
  throw new Error("DB_URL is not set in the environment variables");
}

export const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Middlehill database successfully with Sequelize");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
