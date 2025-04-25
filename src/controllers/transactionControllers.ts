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
  } catch (error) {
    console.log("Error in delete transaction service", error);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};
