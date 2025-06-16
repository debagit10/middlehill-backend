import { Request, Response } from "express";
import { userServices } from "../services/userServices";
import { otpServices } from "../utils/otp";
import { verifyPin } from "../utils/pin";
import {
  encryptToken,
  generateAccessToken,
  generateRefreshToken,
} from "../config/token";

interface SignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  pin: string;
}

interface VerifyData {
  otp: string;
  id: string;
}

interface LoginData {
  phone_number: string;
  pin: string;
}

interface SignInData {
  phone_number: string;
  pin: string;
}

interface EditProfileData_1 {
  pin: string;
  hashedPin: string;
}

interface EditProfileData_2 {
  first_name: string;
  last_name: string;
  phone_number: string;
  otp_code: string;
}

interface ChangePinData {
  otp_code: string;
  newPin: string;
}

export const signUpUser = async (req: Request, res: Response) => {
  const registerData: SignUpData = req.body;

  try {
    const userCheck = await userServices.userExists(registerData.phone_number);

    if (userCheck.exists) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    if (userCheck.suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    if (userCheck.error === "User found but not verified") {
      const otp = otpServices.generateOtp();

      await otpServices.storeOtp(String(userCheck.user?.id), otp);

      res.status(201).json({
        success: "User signed up successfully",
        data: userCheck.user,
        otp,
      });

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
      const otp = otpServices.generateOtp();

      await otpServices.storeOtp(response.data.dataValues.id, otp);

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

export const verify = async (req: Request, res: Response) => {
  const verifyData: VerifyData = req.body;

  try {
    const verified = await userServices.verifyUser(
      verifyData.otp,
      verifyData.id
    );

    if (!verified?.verified) {
      res
        .status(500)
        .json({ error: "User verification failed", message: verified?.error });
      return;
    }

    const accessToken = generateAccessToken({
      userId: verifyData.id,
    });

    const refreshToken = await generateRefreshToken({
      userId: verifyData.id,
    });

    res.status(200).json({
      success: "User successfully verified",
      message: verified?.success,
      accessToken: encryptToken(accessToken),
      refreshToken: encryptToken(refreshToken),
    });

    return;
  } catch (error) {
    console.error("Error verifying user", error);
    res.status(500).json({ error: "Error verifying user" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const loginData: LoginData = req.body;

  try {
    const userExists = await userServices.userExists(loginData.phone_number);

    if (userExists.suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    if (userExists.error === "User found but not verified") {
      res.status(403).json({ error: "User found but not verified" });
      return;
    }

    if (userExists.error === "Error checking user existence") {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (!userExists.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const checkPin = await verifyPin(
      loginData.pin,
      String(userExists.user?.pin)
    );

    if (!checkPin) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const accessToken = generateAccessToken({
      userId: String(userExists.user?.id),
    });

    const refreshToken = await generateRefreshToken({
      userId: String(userExists.user?.id),
    });

    res.status(200).json({
      success: "Login successful",
      user: userExists.user,
      accessToken: encryptToken(accessToken),
      refreshToken: encryptToken(refreshToken),
    });
  } catch (error) {
    console.error("Error in user login", error);
    res.status(500).json({ error: "Error logging user in" });
    return;
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const signInData: SignInData = req.body;

    const userExists = await userServices.userExists(signInData.phone_number);

    if (userExists.suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    if (userExists.error === "User found but not verified") {
      res.status(409).json({ error: "User found but not verified" });
      return;
    }

    if (userExists.error === "Error checking user existence") {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (!userExists.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const checkPin = await verifyPin(
      signInData.pin,
      String(userExists.user?.pin)
    );

    if (!checkPin) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const otp = otpServices.generateOtp();

    await otpServices.storeOtp(String(userExists.user?.id), otp);

    const accessToken = generateAccessToken({
      userId: String(userExists.user?.id),
    });

    const refreshToken = generateRefreshToken({
      userId: String(userExists.user?.id),
    });

    res.status(200).json({
      success: "Login successful",
      user: userExists.user,
      otp,
    });
  } catch (error) {
    console.error("Error signing user in ", error);
    res.status(500).json({ error: "Error - user sign in" });
    return;
  }
};

export const userDetails = async (req: Request, res: Response) => {
  const user_id = res.locals.user_id;

  try {
    const response = await userServices.getUser(user_id);

    if (response.error === "User not found") {
      res.status(404).json(response);
      return;
    }

    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("Error getting user details ", error);
    res.status(500).json({ error: "Error - get user details" });
    return;
  }
};

export const editProfile = async (req: Request, res: Response) => {
  const newData: EditProfileData_1 = req.body;
  // const { user_id } = req.params;

  const user_id = res.locals.user_id;

  try {
    const checkPin = await verifyPin(newData.pin, newData.hashedPin);

    if (!checkPin) {
      res.status(500).json({ error: "Incorrect password" });
      return;
    }

    const otp = otpServices.generateOtp();
    await otpServices.storeOtp(user_id, otp);

    res.status(200).json({ success: "Details saved", otp });
  } catch (error) {
    console.error("Error editting user profile ", error);
    res.status(500).json({ error: "Error - edit user profile" });
    return;
  }
};

export const verifyProfileEdit = async (req: Request, res: Response) => {
  const editData: EditProfileData_2 = req.body;
  // const { user_id } = req.params;

  const user_id = res.locals.user_id;

  try {
    const verify = await otpServices.verifyOtp(user_id, editData.otp_code);

    if (verify.error) {
      res.status(500).json({ error: verify.error });
      return;
    }

    const editUser = await userServices.editUser(user_id, editData);

    if (editUser.error) {
      res.status(500).json({ error: editUser.error });
      return;
    }

    res.status(200).json({ success: editUser.success });
  } catch (error) {
    console.error("Error verifying user profile edit", error);
    res.status(500).json({ error: "Error - user account edit" });
    return;
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  // const { user_id } = req.params;

  const user_id = res.locals.user_id;

  try {
    const response = await userServices.deleteAccount(user_id);

    if (response.error == "Failed to delete account") {
      res.status(500).json({ error: response.error });
      return;
    }

    res.status(200).json({ success: response.success });
  } catch (error) {
    console.error("Error deleting account", error);
    res.status(500).json({ error: "Error - delete user account" });
    return;
  }
};

export const confirmPin = async (req: Request, res: Response) => {
  const { pin } = req.body;
  const user_id = res.locals.user_id;

  try {
    const { error, success } = await userServices.checkPin(user_id, pin);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    const otp = otpServices.generateOtp();
    await otpServices.storeOtp(user_id, otp);

    res.status(200).json({ success, otp });
  } catch (error) {
    console.error("Error confirming pin", error);
    res.status(500).json({ error: "Error - confriming pin" });
  }
};

export const changeUserPin = async (req: Request, res: Response) => {
  const changePinData: ChangePinData = req.body;

  const user_id = res.locals.user_id;

  try {
    const verify = await otpServices.verifyOtp(user_id, changePinData.otp_code);

    if (verify.error) {
      res.status(500).json({ error: verify.error });
      return;
    }

    const response = await userServices.changePin(
      user_id,
      changePinData.newPin
    );

    if (response.error) {
      res.status(500).json({ error: response.error });
      return;
    }

    res.status(200).json({ success: response.success });
  } catch (error) {
    console.error("Error changing pin", error);
    res.status(500).json({ error: "Error - changing user pin" });
    return;
  }
};
