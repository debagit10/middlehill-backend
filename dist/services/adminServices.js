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
        console.log(admin_id);
        const admin = await adminModel_1.Admin.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { [sequelize_1.Op.or]: orConditions },
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
        const admins = await adminModel_1.Admin.findAll();
        if (admins.length === 0) {
            return { error: "No admins found" };
        }
        return { success: "Admins retrieved", data: admins };
    }
    catch (error) {
        console.log("Error in getting all admins", error);
        return { error: "Error getting all admins" };
    }
};
exports.adminServices = {
    adminExists,
    addAdmin,
    getAdmin,
    getAllAdmins,
};
