"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionServices = void 0;
const transactionModel_1 = require("../models/transactionModel");
const addTransaction = async (data) => {
    try {
        const newTransaction = await transactionModel_1.Transaction.create({
            ...data,
            deleted: false,
        });
        return { success: true, data: newTransaction };
    }
    catch (error) {
        console.log("Error in adding transaction service", error);
        return { error: "Error adding transaction" };
    }
};
const userTransactions = async (user_id) => {
    try {
        const transactions = await transactionModel_1.Transaction.findAll({ where: { user_id } });
        if (transactions.length === 0) {
            return { error: "No transactions found" };
        }
        return { success: "Transactions retrieved", data: transactions };
    }
    catch (error) {
        console.log("Error in get user transactions", error);
        return { error: "Error getting user transactions" };
    }
};
const deleteTransaction = async (transaction_id) => {
    try {
        const result = await transactionModel_1.Transaction.update({ deleted: true }, { where: { id: transaction_id } });
        if (result[0] === 0) {
            return { error: "Failed to delete transaction." };
        }
        return { success: "Transaction deleted successfully" };
    }
    catch (error) {
        console.log("Error in delete transaction service", error);
        return { error: "Error deleting transaction" };
    }
};
const checkTransaction = async (transaction_id) => {
    try {
        const transaction = await transactionModel_1.Transaction.findOne({
            where: { id: transaction_id, deleted: false },
        });
        if (!transaction) {
            return { error: "Transaction not found" };
        }
        return { success: "Transaction found", data: transaction };
    }
    catch (error) {
        console.log("Error in check transaction service", error);
        return { error: "Error checking transaction" };
    }
};
exports.transactionServices = {
    addTransaction,
    userTransactions,
    deleteTransaction,
    checkTransaction,
};
