import { Op } from "sequelize";
import { Admin } from "../models/adminModel";
import { hashPin } from "../utils/pin";

interface AdminData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const adminExists = async (email?: string, admin_id?: string) => {
  try {
    const orConditions: any[] = [];

    if (email) orConditions.push({ email });
    if (admin_id) orConditions.push({ id: admin_id });

    const admin = await Admin.findOne({
      where: {
        [Op.and]: [{ [Op.or]: orConditions }, { deleted: false }],
      },
    });

    if (!admin) {
      return { exists: false };
    }

    if (admin.dataValues.suspended) {
      return { suspended: true };
    }

    return {
      exists: true,
      admin: admin.dataValues,
    };
  } catch (error) {
    console.error("Error checking if user exists", error);
    return { exists: false, error: "Error checking user existence" };
  }
};

const addAdmin = async (data: AdminData) => {
  try {
    const newAdmin = await Admin.create({
      ...data,
      password: await hashPin(data.password),
      suspended: false,
      deleted: false,
    });

    return { success: true, data: newAdmin };
  } catch (error) {
    console.log("Error in adding admin service", error);
    return { error: "Error adding admin" };
  }
};

const getAdmin = async (admin_id: string) => {
  try {
    const admin = await Admin.findOne({ where: { id: admin_id } });

    if (!admin) {
      return { error: "Admin not found" };
    }

    return { success: "Admin retrieved", data: admin };
  } catch (error) {
    console.log("Error in getting admin", error);
    return { error: "Error getting admin" };
  }
};

const getAllAdmins = async () => {
  try {
    const admins = await Admin.findAll({
      where: { deleted: false },
      attributes: ["name", "email", "role", "id", "suspended", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    if (admins.length === 0) {
      return { error: "No admins found" };
    }

    return { success: "Admins retrieved", admins };
  } catch (error) {
    console.log("Error in getting all admins", error);
    return { error: "Error getting all admins" };
  }
};

const updateAdmin = async (admin_id: string, editData: AdminData) => {
  try {
    const update = await Admin.update(
      { ...editData },
      { where: { id: admin_id } }
    );

    if (update[0] === 0) {
      return { error: "Failed to update admin profile" };
    }

    const updatedAdmin = await Admin.findOne({
      where: { id: admin_id },
    });

    return {
      success: "Admin profile updated successfully",
      admin: updatedAdmin?.dataValues,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error editting admin" };
  }
};

export const adminServices = {
  adminExists,
  addAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
};
