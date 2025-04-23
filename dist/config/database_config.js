"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbUrl = String(process.env.DB_URL_DEV);
if (!dbUrl) {
    throw new Error("DB_URL is not set in the environment variables");
}
exports.sequelize = new sequelize_1.Sequelize(dbUrl, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});
const connectDB = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log("Connected to Middlehill database successfully with Sequelize");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
exports.connectDB = connectDB;
