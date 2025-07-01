"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_config_1 = require("../config/database_config");
const sequelize_1 = require("sequelize");
const User = database_config_1.sequelize.define("user", {
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4 },
    first_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    last_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    phone_number: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    pin: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    suspended: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    deleted: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    verified: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    mono_id: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    timestamps: true,
    tableName: "users",
    modelName: "user",
});
exports.User = User;
User.sync({ alter: true })
    .then(() => console.log("User table synced successfully."))
    .catch((error) => console.error("Error syncing user table", error));
