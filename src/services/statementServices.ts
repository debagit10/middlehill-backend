import { Statement } from "../models/statementModel";
import { Statement_Txn } from "../models/statement_txnModel";

interface StatementData {
  business_id: string;
  period: string;
  analysed: boolean;
}

interface StatementTxnData {
  statement_id: string;
  type: string;
  amount: number;
  date: Date;
}

const createStatement = async (
  statementData: StatementData,
  statement_txnData: StatementTxnData[]
) => {
  try {
    const statement = await Statement.create(statementData);

    await Statement_Txn.bulkCreate(
      statement_txnData.map((txn) => ({
        ...txn,
        statement_id: statement.dataValues.id,
      }))
    );

    return { success: true, data: statement };
  } catch (error) {
    console.error("Error creating statement:", error);
    return { error: "Error creating statement" };
  }
};

const getStatementById = async (id: string) => {
  try {
    const statement = await Statement.findByPk(id, {
      include: [{ model: Statement_Txn }],
    });

    if (!statement) {
      return { error: "Statement not found" };
    }

    return { success: true, data: statement };
  } catch (error) {
    console.error("Error fetching statement:", error);
    return { error: "Error fetching statement" };
  }
};

export const statementServices = { createStatement, getStatementById };
