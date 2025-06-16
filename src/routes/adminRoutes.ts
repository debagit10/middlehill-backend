import { Router } from "express";
import {
  addAdmin,
  changeAdminPassword,
  deleteAdmin,
  editAdmin,
  getAllAdmins,
  loginAdmin,
  reinstateAdmin,
  suspendAdmin,
} from "../controllers/adminControllers";
import { authorizeAdmin } from "../middlewares/authenticate";
import { authAdmin } from "../middlewares/authorize";

export const adminRouter = Router();

adminRouter.post("/add", addAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.get("/getAll", authAdmin, authorizeAdmin("admin"), getAllAdmins);

adminRouter.put(
  "/edit/:admin_id",
  authAdmin,
  authorizeAdmin("admin"),
  editAdmin
);

adminRouter.put("/update/:admin_id", authAdmin, editAdmin);

adminRouter.put("/change-password/:admin_id", authAdmin, changeAdminPassword);

adminRouter.put(
  "/suspend/:admin_id",
  authAdmin,
  authorizeAdmin("admin"),
  suspendAdmin
);

adminRouter.put(
  "/reinstate/:admin_id",
  authAdmin,
  authorizeAdmin("admin"),
  reinstateAdmin
);

adminRouter.delete(
  "/delete/:admin_id",
  authAdmin,
  authorizeAdmin("admin"),
  deleteAdmin
);
