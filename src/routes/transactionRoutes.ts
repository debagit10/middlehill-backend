import { Router } from "express";
import { addTransaction } from "../controllers/transactionControllers";

export const transactionRouter = Router();

transactionRouter.post("/add/:user_id", addTransaction);
