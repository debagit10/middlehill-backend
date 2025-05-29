import { Router } from "express";

import {
  businessDetails,
  businessTxn,
  deleteBusiness,
  getBusinesses,
  updateBusinessSuspension,
} from "../controllers/businessControllers";
import { authAdmin } from "../middlewares/authorize";
import { authorizeAdmin } from "../middlewares/authenticate";

export const businessRouter = Router();

businessRouter.get(
  "/getList",
  authAdmin,
  authorizeAdmin("admin"),
  getBusinesses
);
businessRouter.get(
  "/details/:business_id",
  authAdmin,
  authorizeAdmin("admin"),
  businessDetails
);
businessRouter.get(
  "/transactions/:business_id",
  authAdmin,
  authorizeAdmin("admin"),
  businessTxn
);

businessRouter.put(
  "/update-suspension/:business_id",
  authAdmin,
  authorizeAdmin("admin"),
  updateBusinessSuspension
);

businessRouter.delete(
  "/delete/:business_id",
  authAdmin,
  authorizeAdmin("admin"),
  deleteBusiness
);
