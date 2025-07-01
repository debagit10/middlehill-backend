"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const sequelize_1 = require("sequelize");
const adminModel_1 = require("../models/adminModel");
const pin_1 = require("../utils/pin");
const adminExists = async (email, admin_id) => {
    try {
        const orConditions = [];
        if (email)
            orConditions.push({ email });
        if (admin_id)
            orConditions.push({ id: admin_id });
        const admin = await adminModel_1.Admin.findOne({
            where: {
                [sequelize_1.Op.and]: [{ [sequelize_1.Op.or]: orConditions }, { deleted: false }],
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
    }
    catch (error) {
        console.error("Error checking if user exists", error);
        return { exists: false, error: "Error checking user existence" };
    }
};
const addAdmin = async (data) => {
    try {
        const newAdmin = await adminModel_1.Admin.create({
            ...data,
            password: await (0, pin_1.hashPin)(data.password),
            suspended: false,
            deleted: false,
        });
        return { success: true, data: newAdmin };
    }
    catch (error) {
        console.log("Error in adding admin service", error);
        return { error: "Error adding admin" };
    }
};
const getAdmin = async (admin_id) => {
    try {
        const admin = await adminModel_1.Admin.findOne({ where: { id: admin_id } });
        if (!admin) {
            return { error: "Admin not found" };
        }
        return { success: "Admin retrieved", data: admin };
    }
    catch (error) {
        console.log("Error in getting admin", error);
        return { error: "Error getting admin" };
    }
};
const getAllAdmins = async () => {
    try {
        const admins = await adminModel_1.Admin.findAll({
            where: { deleted: false },
            attributes: ["name", "email", "role", "id", "suspended", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        if (admins.length === 0) {
            return { error: "No admins found" };
        }
        return { success: "Admins retrieved", admins };
    }
    catch (error) {
        console.log("Error in getting all admins", error);
        return { error: "Error getting all admins" };
    }
};
const updateAdmin = async (admin_id, editData) => {
    try {
        const update = await adminModel_1.Admin.update({ ...editData }, { where: { id: admin_id } });
        if (update[0] === 0) {
            return { error: "Failed to update admin profile" };
        }
        const updatedAdmin = await adminModel_1.Admin.findOne({
            where: { id: admin_id },
        });
        return {
            success: "Admin profile updated successfully",
            admin: updatedAdmin?.dataValues,
        };
    }
    catch (error) {
        console.error(error);
        return { error: "Error editting admin" };
    }
};
const newPassword = async (admin_id, newPassword) => {
    try {
        const edit = await adminModel_1.Admin.update({ password: await (0, pin_1.hashPin)(newPassword) }, { where: { id: admin_id } });
        if (edit[0] === 0) {
            return { error: "Failed to change password" };
        }
        return { success: "Password changed successfully" };
    }
    catch (error) {
        console.error(error);
        return { error: "Error changing password" };
    }
};
exports.adminServices = {
    adminExists,
    addAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin,
    newPassword,
};
