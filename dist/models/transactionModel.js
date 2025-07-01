"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const database_config_1 = require("../config/database_config");
const sequelize_1 = require("sequelize");
const Transaction = database_config_1.sequelize.define("transaction", {
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4 },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    item_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    quantity: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    amount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    deleted: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    timestamps: true,
    tableName: "transactions",
    modelName: "transaction",
});
exports.Transaction = Transaction;
Transaction.sync({ alter: true })
    .then(() => console.log("Transaction table synced successfully."))
    .catch((error) => console.error("Error syncing transaction table", error));
