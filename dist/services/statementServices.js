"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementServices = void 0;
const statementModel_1 = require("../models/statementModel");
const statement_txnModel_1 = require("../models/statement_txnModel");
const createStatement = async (statementData, statement_txnData) => {
    try {
        const statement = await statementModel_1.Statement.create(statementData);
        await statement_txnModel_1.Statement_Txn.bulkCreate(statement_txnData.map((txn) => ({
            ...txn,
            statement_id: statement.dataValues.id,
        })));
        return { success: true, data: statement };
    }
    catch (error) {
        console.error("Error creating statement:", error);
        return { error: "Error creating statement" };
    }
};
const getStatementById = async (id) => {
    try {
        const statement = await statementModel_1.Statement.findByPk(id, {
            include: [{ model: statement_txnModel_1.Statement_Txn }],
        });
        if (!statement) {
            return { error: "Statement not found" };
        }
        return { success: true, data: statement };
    }
    catch (error) {
        console.error("Error fetching statement:", error);
        return { error: "Error fetching statement" };
    }
};
exports.statementServices = { createStatement, getStatementById };
