import { Router } from "express";
import {
  loginUser,
  signInUser,
  signUpUser,
  verify,
} from "../controllers/userControllers";

export const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/signin", signInUser);

userRouter.patch("/verify-signup", verify);
