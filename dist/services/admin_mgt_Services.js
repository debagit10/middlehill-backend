"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_mgt_Services = void 0;
const adminModel_1 = require("../models/adminModel");
const pin_1 = require("../utils/pin");
const editAdmin = async (admin_id, editData) => {
    try {
        const update = await adminModel_1.Admin.update({ ...editData }, { where: { id: admin_id } });
        if (update[0] === 0) {
            return { error: "Failed to update admin profile" };
        }
        return { success: "Admin profile updated successfully" };
    }
    catch (error) {
        console.error(error);
        return { error: "Error editting admin" };
    }
};
const changePassword = async (user_id, editPasswordData) => {
    try {
        const checkPin = await (0, pin_1.verifyPin)(editPasswordData.curPassword, editPasswordData.hashPassword);
        if (!checkPin) {
            return { error: "Incorrect current passwprd" };
        }
        const edit = await adminModel_1.Admin.update({ password: await (0, pin_1.hashPin)(editPasswordData.newPassword) }, { where: { id: user_id } });
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
const suspendAdmin = async (admin_id) => {
    try {
        const result = await adminModel_1.Admin.update({ suspended: true }, { where: { id: admin_id } });
        if (result[0] === 0) {
            return { error: "Failed to suspend admin." };
        }
        return { success: "Admin suspended successfully" };
    }
    catch (error) {
        console.log("Error in suspending admin", error);
        return { error: "Error suspending admin" };
    }
};
const reinstateAdmin = async (admin_id) => {
    try {
        const result = await adminModel_1.Admin.update({ suspended: false }, { where: { id: admin_id } });
        if (result[0] === 0) {
            return { error: "Failed to reinstate admin." };
        }
        return { success: "Admin reinstated successfully" };
    }
    catch (error) {
        console.log("Error in reinstating admin", error);
        return { error: "Error reinstating admin" };
    }
};
const deleteAdmin = async (admin_id) => {
    try {
        const result = await adminModel_1.Admin.update({ deleted: true }, { where: { id: admin_id } });
        if (result[0] === 0) {
            return { error: "Failed to delete admin." };
        }
        return { success: "Admin deleted successfully" };
    }
    catch (error) {
        console.log("Error in deleting admin", error);
        return { error: "Error deleting admin" };
    }
};
exports.admin_mgt_Services = {
    editAdmin,
    changePassword,
    suspendAdmin,
    reinstateAdmin,
    deleteAdmin,
};
