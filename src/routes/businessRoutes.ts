import { Router } from "express";

import {
  businessDetails,
  businessTxn,
  deleteBusiness,
  getBusinesses,
  updateBusinessSuspension,
} from "../controllers/businessControllers";

export const businessRouter = Router();

businessRouter.get("/getList", getBusinesses);
businessRouter.get("/details/:business_id", businessDetails);
businessRouter.get("/transactions/:business_id", businessTxn);

businessRouter.put("/update-suspension/:business_id", updateBusinessSuspension);

businessRouter.delete("/delete/:business_id", deleteBusiness);
