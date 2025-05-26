import { Admin } from "../models/adminModel";
import { hashPin, verifyPin } from "../utils/pin";

interface AdminData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface EditPasswordData {
  curPassword: string;
  newPassword: string;
  hashPassword: string;
}

const editAdmin = async (admin_id: string, editData: AdminData) => {
  try {
    const update = await Admin.update(
      { ...editData },
      { where: { id: admin_id } }
    );

    if (update[0] === 0) {
      return { error: "Failed to update admin profile" };
    }

    return { success: "Admin profile updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Error editting admin" };
  }
};

const changePassword = async (
  user_id: string,
  editPasswordData: EditPasswordData
) => {
  try {
    const checkPin = await verifyPin(
      editPasswordData.curPassword,
      editPasswordData.hashPassword
    );

    if (!checkPin) {
      return { error: "Incorrect current passwprd" };
    }

    const edit = await Admin.update(
      { password: await hashPin(editPasswordData.newPassword) },
      { where: { id: user_id } }
    );

    if (edit[0] === 0) {
      return { error: "Failed to change password" };
    }

    return { success: "Password changed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Error changing password" };
  }
};

const suspendAdmin = async (admin_id: string) => {
  try {
    const result = await Admin.update(
      { suspended: true },
      { where: { id: admin_id } }
    );

    if (result[0] === 0) {
      return { error: "Failed to suspend admin." };
    }

    return { success: "Admin suspended successfully" };
  } catch (error) {
    console.log("Error in suspending admin", error);
    return { error: "Error suspending admin" };
  }
};

const reinstateAdmin = async (admin_id: string) => {
  try {
    const result = await Admin.update(
      { suspended: false },
      { where: { id: admin_id } }
    );

    if (result[0] === 0) {
      return { error: "Failed to reinstate admin." };
    }

    return { success: "Admin reinstated successfully" };
  } catch (error) {
    console.log("Error in reinstating admin", error);
    return { error: "Error reinstating admin" };
  }
};

const deleteAdmin = async (admin_id: string) => {
  try {
    const result = await Admin.update(
      { deleted: true },
      { where: { id: admin_id } }
    );

    if (result[0] === 0) {
      return { error: "Failed to delete admin." };
    }

    return { success: "Admin deleted successfully" };
  } catch (error) {
    console.log("Error in deleting admin", error);
    return { error: "Error deleting admin" };
  }
};

export const admin_mgt_Services = {
  editAdmin,
  changePassword,
  suspendAdmin,
  reinstateAdmin,
  deleteAdmin,
};
