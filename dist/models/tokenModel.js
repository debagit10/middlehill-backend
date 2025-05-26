"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database_config");
const Token = database_config_1.sequelize.define("otp", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "tokens",
    modelName: "token",
});
exports.Token = Token;
// Sync the User model with the database (create the table if it doesn't exist)
Token.sync({ alter: true })
    .then(() => console.log("Token table synced successfully"))
    .catch((error) => console.error("Error syncing OTP table:", error));
