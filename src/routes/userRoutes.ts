import { Router } from "express";
import {
  loginUser,
  signInUser,
  signUpUser,
  verify,
  deleteUserAccount,
  editProfile,
  verifyProfileEdit,
  changeUserPin,
} from "../controllers/userControllers";

export const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/signin", signInUser);

userRouter.patch("/verify-signup", verify);
userRouter.patch("/delete-account/:user_id", deleteUserAccount);
userRouter.patch("/edit-profile/:user_id", editProfile);
userRouter.patch("/verify-edit/:user_id", verifyProfileEdit);
userRouter.patch("/change-pin/:user_id", changeUserPin);
