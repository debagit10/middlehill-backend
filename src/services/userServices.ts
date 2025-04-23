import { User } from "../models/userModel";
import { verifyOtp } from "../utils/otp";
import { hashPin } from "../utils/pin";

interface SignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  pin: string;
  suspended: boolean;
  deleted: boolean;
}

const userExists = async (phone_number: string) => {
  try {
    const user = await User.findOne({
      where: { phone_number, deleted: false, suspended: false },
    });

    if (!user) {
      return { exists: false };
    }

    if (user.dataValues.verified) {
      return { exists: true, user: user?.dataValues };
    }

    return { exists: false, error: "User found but not verified" };
  } catch (error) {
    console.error("Error checking if user exists", error);
    return { exists: false, error: "Error checking user existence" };
  }
};

export const addUser = async (data: SignUpData) => {
  try {
    const newUser = await User.create({
      ...data,
      pin: await hashPin(data.pin),
      verified: false,
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.log("Error registering user", error);
    return { error: { "Error registering user": error } };
  }
};

const verifyUser = async (otp: string, user_id: string) => {
  try {
    const verify = await verifyOtp(user_id, otp);

    if (verify.success) {
      const response = await User.update(
        { verified: true },
        { where: { id: user_id } }
      );

      if (response) {
        return { verified: true, success: verify.success };
      }
    } else {
      return { verified: false, error: verify.error };
    }
  } catch (error) {
    console.error(error);
    return { error: { "Error verifying user": error } };
  }
};

export const userServices = { verifyUser, addUser, userExists };
