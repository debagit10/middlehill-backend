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
  userDetails,
} from "../controllers/userControllers";
import { authUser } from "../middlewares/authorize";

export const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/signin", signInUser);

userRouter.get("/details", authUser, userDetails);

userRouter.patch("/verify-signup", verify);
userRouter.patch("/delete-account", authUser, deleteUserAccount);
userRouter.patch("/edit-profile", authUser, editProfile);
userRouter.patch("/verify-edit", authUser, verifyProfileEdit);
userRouter.patch("/change-pin", authUser, changeUserPin);
