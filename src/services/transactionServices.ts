import { Transaction } from "../models/transactionModel";

interface TransactionData {
  item_name: string;
  quantity: string;
  amount: number;
}

const addTransaction = async (
  data: TransactionData | TransactionData[],
  user_id: string
) => {
  try {
    const transactions = Array.isArray(data) ? data : [data];

    const newTransactions = await Transaction.bulkCreate(
      transactions.map((txn) => ({
        ...txn,
        user_id,
        deleted: false,
      }))
    );

    return { success: true, data: newTransactions };
  } catch (error) {
    console.log("Error in adding transaction service", error);
    return { error: "Error adding transaction" };
  }
};

const userTransactions = async (user_id: string) => {
  try {
    const transactions = await Transaction.findAll({ where: { user_id } });

    if (transactions.length === 0) {
      return { error: "No transactions found" };
    }

    return { success: "Transactions retrieved", data: transactions };
  } catch (error) {
    console.log("Error in get user transactions", error);
    return { error: "Error getting user transactions" };
  }
};

const deleteTransaction = async (transaction_id: string) => {
  try {
    const result = await Transaction.update(
      { deleted: true },
      { where: { id: transaction_id } }
    );

    if (result[0] === 0) {
      return { error: "Failed to delete transaction." };
    }

    return { success: "Transaction deleted successfully" };
  } catch (error) {
    console.log("Error in delete transaction service", error);
    return { error: "Error deleting transaction" };
  }
};

const checkTransaction = async (transaction_id: string) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: transaction_id, deleted: false },
    });

    if (!transaction) {
      return { error: "Transaction not found" };
    }

    return { success: "Transaction found", data: transaction };
  } catch (error) {
    console.log("Error in check transaction service", error);
    return { error: "Error checking transaction" };
  }
};

export const transactionServices = {
  addTransaction,
  userTransactions,
  deleteTransaction,
  checkTransaction,
};
