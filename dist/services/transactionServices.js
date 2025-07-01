"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionServices = void 0;
const transactionModel_1 = require("../models/transactionModel");
const addTransaction = async (data, user_id) => {
    try {
        const transactions = Array.isArray(data) ? data : [data];
        const newTransactions = await transactionModel_1.Transaction.bulkCreate(transactions.map((txn) => ({
            ...txn,
            user_id,
            deleted: false,
        })));
        return { success: true, data: newTransactions };
    }
    catch (error) {
        console.log("Error in adding transaction service", error);
        return { error: "Error adding transaction" };
    }
};
const userTransactions = async (user_id) => {
    try {
        const transactions = await transactionModel_1.Transaction.findAll({
            where: { user_id, deleted: false },
            order: [["createdAt", "DESC"]],
        });
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
const allTransaction = async () => {
    try {
        const transactions = await transactionModel_1.Transaction.findAll({
            where: { deleted: false },
            order: [["createdAt", "DESC"]],
        });
        if (!transactions.length) {
            return { error: "No transactions found.", transactions: null };
        }
        return {
            success: "transactions retrieved",
            transactions,
            count: transactions.length,
        };
    }
    catch (error) {
        console.log("Error in getting transaction service", error);
        return { error: "Error getting transactions" };
    }
};
exports.transactionServices = {
    addTransaction,
    userTransactions,
    deleteTransaction,
    checkTransaction,
    allTransaction,
};
