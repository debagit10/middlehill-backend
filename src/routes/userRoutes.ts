import { Router } from "express";
import {
  loginUser,
  signUpUser,
  verifySignUp,
} from "../controllers/userControllers";

export const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);

userRouter.patch("/verify-signup", verifySignUp);
