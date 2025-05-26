import { Request, Response } from "express";
import { otpServices } from "./otp";

export const resendOtp = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const otp = otpServices.generateOtp();

    await otpServices.storeOtp(user_id, otp);

    res.status(200).json({ success: "Otp resent", otp });
  } catch (error) {
    console.error("Error resending otp:", error);
    res.status(500).json({ error: "Error resending otp" });
  }
};
