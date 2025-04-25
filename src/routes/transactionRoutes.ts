import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transactionControllers";

export const transactionRouter = Router();

transactionRouter.post("/add/:user_id", addTransaction);

transactionRouter.get("/get/:user_id", getTransactions);

transactionRouter.delete("/delete/:transaction_id", deleteTransaction);
