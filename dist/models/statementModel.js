"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database_config");
const Statement = database_config_1.sequelize.define("statements", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    business_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    period: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    analysed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: "statements",
    modelName: "statement",
});
exports.Statement = Statement;
Statement.sync({ alter: true })
    .then(() => console.log("Statement table synced successfully"))
    .catch((error) => console.error("Error syncing Statement table:", error));
