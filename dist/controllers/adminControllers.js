"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.deleteAdmin = exports.reinstateAdmin = exports.suspendAdmin = exports.changeAdminPassword = exports.editAdmin = exports.updateAdmin = exports.getAllAdmins = exports.loginAdmin = exports.addAdmin = void 0;
const adminServices_1 = require("../services/adminServices");
const admin_mgt_Services_1 = require("../services/admin_mgt_Services");
const pin_1 = require("../utils/pin");
const token_1 = require("../config/token");
const tokenModel_1 = require("../models/tokenModel");
const otp_1 = require("../utils/otp");
const addAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        const { exists, suspended } = await adminServices_1.adminServices.adminExists(adminData.email);
        if (exists) {
            res.status(409).json({ error: "Admin already exists" });
            return;
        }
        if (suspended) {
            res.status(403).json({ error: "Account suspended" });
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
        const { exists, error, admin, suspended } = await adminServices_1.adminServices.adminExists(adminData.email);
        if (!exists) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        if (suspended) {
            res.status(403).json({ error: "Account suspended" });
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
        const accessToken = (0, token_1.generateAccessToken)({
            userId: String(admin?.id),
            role: admin?.role,
        });
        const refreshToken = await (0, token_1.generateRefreshToken)({
            userId: String(admin?.id),
            role: admin?.role,
        });
        if (admin?.id) {
            await tokenModel_1.Token.create({
                user_id: admin?.id,
                token: refreshToken,
            });
        }
        res.cookie("refreshToken", (0, token_1.encryptToken)(refreshToken), {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful",
            admin,
            accessToken: (0, token_1.encryptToken)(accessToken),
        });
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
        const { success, error, admins } = await adminServices_1.adminServices.getAllAdmins();
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success, admins });
    }
    catch (error) {
        console.error("Error in getAllAdmins controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllAdmins = getAllAdmins;
const updateAdmin = async (req, res) => {
    const { admin_id } = req.params;
    try {
        const editData = req.body;
        if (editData.email) {
            const { exists } = await adminServices_1.adminServices.adminExists(editData.email);
            if (exists) {
                res.status(500).json({ error: "Email already exists" });
                return;
            }
        }
        const { success, error, admin } = await adminServices_1.adminServices.updateAdmin(admin_id, editData);
        if (error) {
            res.status(404).json({ error });
            return;
        }
        res.status(200).json({ success, admin });
    }
    catch (error) {
        console.error("Error in update Admin controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateAdmin = updateAdmin;
const editAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const editData = req.body;
        if (editData.email) {
            const { exists } = await adminServices_1.adminServices.adminExists(editData.email);
            if (exists) {
                res.status(500).json({ error: "Email already exists" });
                return;
            }
        }
        const { success, error } = await admin_mgt_Services_1.admin_mgt_Services.editAdmin(admin_id, editData);
        console.log(admin_id);
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
        const { email } = req.params;
        const passwordData = req.body;
        const { exists, admin, suspended } = await adminServices_1.adminServices.adminExists(email);
        if (!exists) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        if (suspended) {
            res.status(403).json({ error: "Account suspended" });
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
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { exists, error, admin } = await adminServices_1.adminServices.adminExists(email);
        if (!exists) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        if (error) {
            res.status(500).json({ error });
            return;
        }
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(String(admin?.id), otp);
        const accessToken = (0, token_1.generateAccessToken)({
            userId: String(admin?.id),
            role: admin?.role,
        });
        res.status(200).json({
            message: "OTP sent to your email",
            admin,
            otp,
            accessToken: (0, token_1.encryptToken)(accessToken),
        });
    }
    catch (error) {
        console.error("Error in forgotPassword controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { admin_id } = req.params;
        const { success, error } = await adminServices_1.adminServices.newPassword(admin_id, newPassword);
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.status(200).json({ success, message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error in resetPassword controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
