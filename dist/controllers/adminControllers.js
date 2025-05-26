"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.reinstateAdmin = exports.suspendAdmin = exports.changeAdminPassword = exports.editAdmin = exports.getAllAdmins = exports.loginAdmin = exports.addAdmin = void 0;
const adminServices_1 = require("../services/adminServices");
const admin_mgt_Services_1 = require("../services/admin_mgt_Services");
const pin_1 = require("../utils/pin");
const addAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        const adminCheck = await adminServices_1.adminServices.adminExists(adminData.email);
        if (adminCheck.exists) {
            res.status(409).json({ error: "Admin already exists" });
            return;
        }
        const { success, error, data } = await adminServices_1.adminServices.addAdmin({
            ...adminData,
        });
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res
            .status(201)
            .json({ success, message: "Admin added successfully", data });
        return;
    }
    catch (error) {
        console.error("Error in addAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
exports.addAdmin = addAdmin;
const loginAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        const { exists, error, admin } = await adminServices_1.adminServices.adminExists(adminData.email);
        if (!exists) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        if (error) {
            res.status(401).json({ error });
            return;
        }
        const checkPin = await (0, pin_1.verifyPin)(adminData.password, String(admin?.password));
        if (!checkPin) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        res.status(200).json({ message: "Login successful", admin });
        return;
    }
    catch (error) {
        console.error("Error in loginAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
exports.loginAdmin = loginAdmin;
const getAllAdmins = async (req, res) => {
    try {
        const { success, error, data } = await adminServices_1.adminServices.getAllAdmins();
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success, data });
    }
    catch (error) {
        console.error("Error in getAllAdmins controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllAdmins = getAllAdmins;
const editAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const editData = req.body;
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.editAdmin(admin_id, editData);
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success });
    }
    catch (error) {
        console.error("Error in editAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.editAdmin = editAdmin;
const changeAdminPassword = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const passwordData = req.body;
        const { exists, admin } = await adminServices_1.adminServices.adminExists(admin_id);
        if (!exists) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        if (!admin || !admin.password) {
            res.status(500).json({ error: "Admin password not found" });
            return;
        }
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.changePassword(admin.id, {
            ...passwordData,
            hashPassword: admin.password,
        });
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success });
    }
    catch (error) {
        console.error("Error in changeAdminPassword controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.changeAdminPassword = changeAdminPassword;
const suspendAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.suspendAdmin(admin_id);
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success });
    }
    catch (error) {
        console.error("Error in suspendAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.suspendAdmin = suspendAdmin;
const reinstateAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.reinstateAdmin(admin_id);
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success });
    }
    catch (error) {
        console.error("Error in reinstateAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.reinstateAdmin = reinstateAdmin;
const deleteAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.deleteAdmin(admin_id);
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success });
    }
    catch (error) {
        console.error("Error in deleteAdmin controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteAdmin = deleteAdmin;
