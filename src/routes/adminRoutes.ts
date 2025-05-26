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

export const adminRouter = Router();

adminRouter.post("/add", addAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.get("/getAll", getAllAdmins);

adminRouter.put("/edit/:admin_id", editAdmin);
adminRouter.put("/change-password/:admin_id", changeAdminPassword);
adminRouter.put("/suspend/:admin_id", suspendAdmin);
adminRouter.put("/reinstate/:admin_id", reinstateAdmin);

adminRouter.delete("/delete/:admin_id", deleteAdmin);
