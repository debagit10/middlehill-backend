import { User } from "../models/userModel";
import { otpServices } from "../utils/otp";
import { hashPin, verifyPin } from "../utils/pin";

interface SignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  pin: string;
  suspended: boolean;
  deleted: boolean;
}

interface EditUserData {
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface EditPinData {
  curPin: string;
  newPin: string;
}

const userExists = async (phone_number: string) => {
  try {
    const user = await User.findOne({
      where: { phone_number, deleted: false },
    });

    if (!user) {
      return { exists: false };
    }

    if (user.dataValues.suspended) {
      return { suspended: true };
    }

    if (user.dataValues.verified) {
      return { exists: true, user: user?.dataValues };
    }

    return {
      exists: false,
      error: "User found but not verified",
      user: user.dataValues,
    };
  } catch (error) {
    console.error("Error checking if user exists", error);
    return { exists: false, error: "Error checking user existence" };
  }
};

const getUser = async (user_id: string) => {
  try {
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return { error: "User not found" };
    }

    return { success: "User found", user };
  } catch (error) {
    console.error("Error getting user details", error);
    return { exists: false, error: "Error getting user details" };
  }
};

const addUser = async (data: SignUpData) => {
  try {
    const newUser = await User.create({
      ...data,
      pin: await hashPin(data.pin),
      verified: false,
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.log("Error registering user", error);
    return { error: "Error registering user" };
  }
};

const verifyUser = async (otp: string, phone_number: string) => {
  try {
    const verify = await otpServices.verifyOtp(phone_number, otp);

    if (verify.success) {
      const response = await User.update(
        { verified: true },
        { where: { id: phone_number } }
      );

      if (response) {
        return { verified: true, success: verify.success };
      }
    } else {
      return { verified: false, error: verify.error };
    }
  } catch (error) {
    console.error(error);
    return { error: "Error verifying user" };
  }
};

const editUser = async (user_id: string, editData: EditUserData) => {
  try {
    const update = await User.update(
      { ...editData },
      { where: { id: user_id } }
    );

    if (update[0] === 0) {
      return { error: "Failed to update profile" };
    }

    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Error editting user" };
  }
};

const deleteAccount = async (user_id: string) => {
  console.log(user_id);
  try {
    const result = await User.update(
      { deleted: true },
      { where: { id: user_id } }
    );

    console.log(result);

    if (result[0] === 0) {
      return { error: "Failed to delete account" };
    }

    return { success: "Account deleted successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting account" };
  }
};

const changePin = async (user_id: string, editPinData: EditPinData) => {
  try {
    const user = await User.findOne({
      where: { id: user_id, deleted: false, suspended: false },
      attributes: ["pin"],
    });

    if (!user) {
      return { error: "User not found or account is suspended/deleted" };
    }

    const checkPin = await verifyPin(editPinData.curPin, user.dataValues.pin);

    if (!checkPin) {
      return { error: "Incorrect current pin" };
    }

    const edit = await User.update(
      { pin: await hashPin(editPinData.newPin) },
      { where: { id: user_id } }
    );

    if (edit[0] === 0) {
      return { error: "Failed to edit pin" };
    }

    return { success: "Pin changed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Error editting pin" };
  }
};

export const userServices = {
  verifyUser,
  addUser,
  userExists,
  editUser,
  changePin,
  deleteAccount,
  getUser,
};
