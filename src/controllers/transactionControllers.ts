import { transactionServices } from "../services/transactionServices";
import { Request, Response } from "express";

interface TransactionData {
  item_name: string;
  quantity: string;
  amount: number;
}

export const addTransaction = async (req: Request, res: Response) => {
  const transactionData: TransactionData = req.body;
  const { user_id } = req.params;

  try {
    const response = await transactionServices.addTransaction({
      ...transactionData,
      user_id,
    });

    if (response.error) {
      res.status(500).json({ error: "Failed to add transaction" });
    }

    res.status(201).json({ success: "Transaction added", data: response.data });
    return;
  } catch (error) {
    console.log("Error in delete transaction controller", error);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const response = await transactionServices.userTransactions(user_id);

    if (response.error === "No transactions found") {
      res.status(404).json({ error: "No transactions found" });
      return;
    }

    res
      .status(200)
      .json({ success: "Transactions found", data: response.data });
    return;
  } catch (error) {
    console.log("Error in get transaction controller", error);
    res.status(500).json({ error: "Failed to get transaction" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await transactionServices.checkTransaction(
      transaction_id
    );

    if (transaction.error === "Transaction not found") {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    const response = await transactionServices.deleteTransaction(
      transaction_id
    );

    if (response.error === "Failed to delete transaction.") {
      res.status(500).json({ error: "Failed to delete transaction" });
      return;
    }

    res.status(200).json({ success: "Transaction deleted" });
  } catch (error) {
    console.log("Error in delete transaction controller", error);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};
