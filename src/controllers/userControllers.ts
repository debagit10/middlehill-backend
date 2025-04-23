import { Request, Response } from "express";
import { userServices } from "../services/userServices";
import { generateOtp, storeOtp } from "../utils/otp";

interface SignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  pin: string;
}

interface VerifyData {
  user_id: string;
  otp: string;
}

export const signUpUser = async (req: Request, res: Response) => {
  const registerData: SignUpData = req.body;

  try {
    const userCheck = await userServices.userExists(registerData.phone_number);

    if (userCheck.exists) {
      res.status(409).json({ error: "User already exists and verified" });
      return;
    }

    if (userCheck.error === "User found but not verified") {
      res.status(409).json({ error: "User found but not verified" });
      return;
    }

    if (userCheck.error === "Error checking user existence") {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const response = await userServices.addUser({
      ...registerData,
      suspended: false,
      deleted: false,
    });

    if (response.success) {
      const otp = generateOtp();

      await storeOtp(response.data.dataValues.id, otp);

      res.status(201).json({
        success: "User signed up successfully",
        data: response.data,
        otp,
      });
      return;
    }

    res.status(400).json({ error: "Unable to register user" });
    return;
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ error: "Error registering user" });
    return;
  }
};

export const verifySignUp = async (req: Request, res: Response) => {
  const verifyData: VerifyData = req.body;

  try {
    const verified = await userServices.verifyUser(
      verifyData.otp,
      verifyData.user_id
    );

    if (!verified?.verified) {
      res
        .status(500)
        .json({ error: "User verification failed", message: verified?.error });
      return;
    }

    res.status(200).json({
      success: "User successfully verified",
      message: verified?.success,
    });

    return;
  } catch (error) {
    console.error("Error verifying user", error);
    res.status(500).json({ error: "Error verifying user" });
    return;
  }
};
