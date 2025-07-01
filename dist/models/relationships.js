"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("./userModel");
const transactionModel_1 = require("./transactionModel");
const userProfileModel_1 = require("./userProfileModel");
const statementModel_1 = require("./statementModel");
const statement_txnModel_1 = require("./statement_txnModel");
userModel_1.User.hasOne(userProfileModel_1.User_Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
userProfileModel_1.User_Profile.belongsTo(userModel_1.User, { foreignKey: "user_id" });
userModel_1.User.hasMany(transactionModel_1.Transaction, { foreignKey: "user_id", onDelete: "CASCADE" });
transactionModel_1.Transaction.belongsTo(userModel_1.User, { foreignKey: "user_id" });
statementModel_1.Statement.hasMany(statement_txnModel_1.Statement_Txn, {
    foreignKey: "statement_id",
    onDelete: "CASCADE",
});
statement_txnModel_1.Statement_Txn.belongsTo(statementModel_1.Statement, { foreignKey: "statement_id" });
