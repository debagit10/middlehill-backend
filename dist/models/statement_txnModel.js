"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement_Txn = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database_config");
const Statement_Txn = database_config_1.sequelize.define("statement_txn", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    statement_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    amount: sequelize_1.DataTypes.FLOAT,
    date: sequelize_1.DataTypes.DATE,
}, {
    timestamps: true,
    tableName: "statements_txn",
    modelName: "statement_txn",
});
exports.Statement_Txn = Statement_Txn;
Statement_Txn.sync({ alter: true })
    .then(() => console.log("Statement table synced successfully"))
    .catch((error) => console.error("Error syncing Statement table:", error));
