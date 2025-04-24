import { Transaction } from "../models/transactionModel";

interface TransactionData {
  user_id: string;
  item_name: string;
  quantity: number;
  amount: number;
}

const addTransaction = async (data: TransactionData) => {
  try {
    const newTransaction = await Transaction.create({
      ...data,
      deleted: false,
    });

    return { success: true, data: newTransaction };
  } catch (error) {
    console.log("Error in adding transaction service", error);
    return { error: "Error adding transaction" };
  }
};

const userTransactions = async (user_id: string) => {
  try {
    const transactions = await Transaction.findAll({ where: { user_id } });

    if (!transactions) {
      return { error: "No transactions found" };
    }

    return { success: "transaction found", data: transactions };
  } catch (error) {
    console.log("Error in get user transactions", error);
    return { error: "Error getting user transactions" };
  }
};

const deleteTransaction = async (trancation_id: string) => {
  try {
    const deleteTransaction = await Transaction.update(
      { deleted: true },
      { where: { id: trancation_id } }
    );

    if (deleteTransaction[0] !== 0) {
      return { error: "Failed to delete transaction." };
    }

    return { success: "Transaction deleted successfully" };
  } catch (error) {
    console.log("Error in delete transaction service", error);
    return { error: "Error adding transaction" };
  }
};

const checkTransaction = async (transaction_id: string) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: transaction_id },
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
