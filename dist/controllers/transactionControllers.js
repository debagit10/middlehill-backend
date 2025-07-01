"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTransactions = exports.deleteTransaction = exports.getTransactions = exports.addTransaction = void 0;
const transactionServices_1 = require("../services/transactionServices");
const addTransaction = async (req, res) => {
    const transactionData = req.body;
    const user_id = res.locals.user_id;
    try {
        const response = await transactionServices_1.transactionServices.addTransaction(transactionData, user_id);
        if (response.error) {
            res.status(500).json({ error: "Failed to add transaction" });
            return;
        }
        res.status(201).json({ success: "Transaction added", data: response.data });
        return;
    }
    catch (error) {
        console.log("Error in delete transaction controller", error);
        res.status(500).json({ error: "Failed to add transaction" });
    }
};
exports.addTransaction = addTransaction;
const getTransactions = async (req, res) => {
    const user_id = res.locals.user_id;
    try {
        const response = await transactionServices_1.transactionServices.userTransactions(user_id);
        if (response.error === "No transactions found") {
            res.status(404).json({ error: "No transactions found" });
            return;
        }
        res
            .status(200)
            .json({ success: "Transactions found", data: response.data });
        return;
    }
    catch (error) {
        console.log("Error in get transaction controller", error);
        res.status(500).json({ error: "Failed to get transaction" });
    }
};
exports.getTransactions = getTransactions;
const deleteTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const transaction = await transactionServices_1.transactionServices.checkTransaction(transaction_id);
        if (transaction.error === "Transaction not found") {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }
        const response = await transactionServices_1.transactionServices.deleteTransaction(transaction_id);
        if (response.error === "Failed to delete transaction.") {
            res.status(500).json({ error: "Failed to delete transaction" });
            return;
        }
        res.status(200).json({ success: "Transaction deleted" });
    }
    catch (error) {
        console.log("Error in delete transaction controller", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
};
exports.deleteTransaction = deleteTransaction;
const allTransactions = async (req, res) => {
    try {
        const response = await transactionServices_1.transactionServices.allTransaction();
        if (response.transactions == null) {
            res.status(404).json(response);
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in get transactions controller", error);
        res.status(500).json({ error: "Failed to get transactions" });
        return;
    }
};
exports.allTransactions = allTransactions;
