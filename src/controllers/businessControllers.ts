import { Request, Response } from "express";

import { business_Services } from "../services/businessServices";

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const response = await business_Services.businessList();

    if (response.businesses == null) {
      res.status(404).json({ error: "No businesses found" });
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.log("Error in get businesses controller", error);
    res.status(500).json({ error: "Failed to get businesses" });
    return;
  }
};

export const businessDetails = async (req: Request, res: Response) => {
  const { business_id } = req.params;
  try {
    const response = await business_Services.businessDetails(business_id);

    if (response.error) {
      res.status(500).json({ error: response.error });
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.log("Error in get business details controller", error);
    res.status(500).json({ error: "Failed to get business details" });
    return;
  }
};

export const businessTxn = async (req: Request, res: Response) => {
  const { business_id } = req.params;
  try {
    const response = await business_Services.businessTxn(business_id);

    if (response.transactions == null) {
      res.status(404).json({ error: response.error });
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.log("Error in get business transaction controller", error);
    res.status(500).json({ error: "Failed to get business transactions" });
    return;
  }
};

export const updateBusinessSuspension = async (req: Request, res: Response) => {
  const { business_id } = req.params;
  const { suspend } = req.body;

  try {
    const response = await business_Services.toggleBusinessSuspension(
      business_id,
      suspend
    );

    if (response.error) {
      res.status(400).json(response);
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.log("Error in update business suspension controller", error);
    res
      .status(500)
      .json({ error: "Failed to update business suspension transactions" });
    return;
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const { business_id } = req.params;

  try {
    const response = await business_Services.deleteBusiness(business_id);

    if (response.error) {
      res.status(400).json(response);
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.log("Error in delete business controller", error);
    res.status(500).json({ error: "Failed to delete business" });
    return;
  }
};
