import { Router } from "express";
import { uploadStatement } from "../controllers/statementControllers";
import { authUser } from "../middlewares/authorize";

export const statementRouter = Router();

statementRouter.post("/upload", authUser, uploadStatement);
