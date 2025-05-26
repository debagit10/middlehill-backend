"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const database_config_1 = require("../config/database_config");
const sequelize_1 = require("sequelize");
exports.Admin = database_config_1.sequelize.define("admin", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    suspended: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { timestamps: true, tableName: "admins", modelName: "admin" });
// Sync the Admin model with the database (create the table if it doesn't exist)
exports.Admin.sync({ alter: true })
    .then(() => console.log("Admin table synced successfully"))
    .catch((error) => console.error("Error syncing Admin table:", error));
