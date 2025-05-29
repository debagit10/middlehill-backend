import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  allTransactions,
} from "../controllers/transactionControllers";
import { authAdmin, authUser } from "../middlewares/authorize";
import { authorizeAdmin } from "../middlewares/authenticate";

export const transactionRouter = Router();

transactionRouter.post("/add", authUser, addTransaction);

transactionRouter.get("/get", authUser, getTransactions);

transactionRouter.get(
  "/getAll",
  authAdmin,
  authorizeAdmin("admin"),
  allTransactions
); // auth admin

transactionRouter.delete(
  "/delete/:transaction_id",
  authUser,
  deleteTransaction
);
