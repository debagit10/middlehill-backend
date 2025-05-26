import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transactionControllers";
import { authUser } from "../middlewares/authorize";

export const transactionRouter = Router();

transactionRouter.post("/add", authUser, addTransaction);

transactionRouter.get("/get", authUser, getTransactions);

transactionRouter.delete(
  "/delete/:transaction_id",
  authUser,
  deleteTransaction
);
