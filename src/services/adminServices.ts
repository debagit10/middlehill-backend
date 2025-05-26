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

    console.log(admin_id);

    const admin = await Admin.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: orConditions },
          { deleted: false },
          { suspended: false },
        ],
      },
    });

    if (!admin) {
      return { exists: false };
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
    const admins = await Admin.findAll();

    if (admins.length === 0) {
      return { error: "No admins found" };
    }

    return { success: "Admins retrieved", data: admins };
  } catch (error) {
    console.log("Error in getting all admins", error);
    return { error: "Error getting all admins" };
  }
};

export const adminServices = {
  adminExists,
  addAdmin,
  getAdmin,
  getAllAdmins,
};
