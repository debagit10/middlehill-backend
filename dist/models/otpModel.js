"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database_config");
const OTP = database_config_1.sequelize.define("otp", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    otp_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: "otps",
    modelName: "otp",
});
exports.OTP = OTP;
// Sync the User model with the database (create the table if it doesn't exist)
OTP.sync({ alter: true })
    .then(() => console.log("OTP table synced successfully"))
    .catch((error) => console.error("Error syncing OTP table:", error));
