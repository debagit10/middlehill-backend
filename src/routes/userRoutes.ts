import { Router } from "express";
import { signUpUser, verifySignUp } from "../controllers/userControllers";

export const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.patch("/verify-signup", verifySignUp);
