"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Profile = void 0;
const database_config_1 = require("../config/database_config");
const sequelize_1 = require("sequelize");
const User_Profile = database_config_1.sequelize.define("user_profiles", {
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4 },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    bank_acc_no: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    bank_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    business_name: { type: sequelize_1.DataTypes.STRING, defaultValue: false },
    pic: { type: sequelize_1.DataTypes.STRING, defaultValue: false },
    address: { type: sequelize_1.DataTypes.STRING, defaultValue: false },
}, {
    timestamps: true,
    tableName: "user_profiles",
    modelName: "user_profile",
});
exports.User_Profile = User_Profile;
User_Profile.sync({ alter: true })
    .then(() => console.log("User profile table synced successfully."))
    .catch((error) => console.error("Error syncing user profile table", error));
