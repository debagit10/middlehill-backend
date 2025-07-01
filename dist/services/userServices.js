"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const userModel_1 = require("../models/userModel");
const otp_1 = require("../utils/otp");
const pin_1 = require("../utils/pin");
const userExists = async (phone_number) => {
    try {
        const user = await userModel_1.User.findOne({
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
    }
    catch (error) {
        console.error("Error checking if user exists", error);
        return { exists: false, error: "Error checking user existence" };
    }
};
const getUser = async (user_id) => {
    try {
        const user = await userModel_1.User.findOne({ where: { id: user_id } });
        if (!user) {
            return { error: "User not found" };
        }
        return { success: "User found", user };
    }
    catch (error) {
        console.error("Error getting user details", error);
        return { exists: false, error: "Error getting user details" };
    }
};
const addUser = async (data) => {
    try {
        const newUser = await userModel_1.User.create({
            ...data,
            pin: await (0, pin_1.hashPin)(data.pin),
            verified: false,
            email: "",
        });
        return { success: true, data: newUser };
    }
    catch (error) {
        console.log("Error registering user", error);
        return { error: "Error registering user" };
    }
};
const verifyUser = async (otp, user_id) => {
    try {
        const verify = await otp_1.otpServices.verifyOtp(user_id, otp);
        if (verify.success) {
            const response = await userModel_1.User.update({ verified: true }, { where: { id: user_id } });
            if (response) {
                return { verified: true, success: verify.success };
            }
        }
        else {
            return { verified: false, error: verify.error };
        }
    }
    catch (error) {
        console.error(error);
        return { error: "Error verifying user" };
    }
};
const editUser = async (user_id, editData) => {
    try {
        const update = await userModel_1.User.update({ ...editData }, { where: { id: user_id } });
        if (update[0] === 0) {
            return { error: "Failed to update profile" };
        }
        return { success: "Profile updated successfully" };
    }
    catch (error) {
        console.error(error);
        return { error: "Error editting user" };
    }
};
const deleteAccount = async (user_id) => {
    try {
        const result = await userModel_1.User.update({ deleted: true }, { where: { id: user_id } });
        console.log(result);
        if (result[0] === 0) {
            return { error: "Failed to delete account" };
        }
        return { success: "Account deleted successfully" };
    }
    catch (error) {
        console.error(error);
        return { error: "Error deleting account" };
    }
};
const checkPin = async (user_id, pin) => {
    try {
        const user = await userModel_1.User.findOne({
            where: { id: user_id, deleted: false, suspended: false },
            attributes: ["pin"],
        });
        if (!user) {
            return { error: "User not found or account is suspended/deleted" };
        }
        const checkPin = await (0, pin_1.verifyPin)(pin, user.dataValues.pin);
        if (!checkPin) {
            return { error: "Incorrect current pin" };
        }
        return { success: "Pin verified successfully" };
    }
    catch (error) {
        console.error("Error verifying pin", error);
        return { error: "Error verifying pin" };
    }
};
const changePin = async (user_id, newPin) => {
    try {
        const edit = await userModel_1.User.update({ pin: await (0, pin_1.hashPin)(newPin) }, { where: { id: user_id } });
        if (edit[0] === 0) {
            return { error: "Failed to edit pin" };
        }
        return { success: "Pin changed successfully" };
    }
    catch (error) {
        console.error(error);
        return { error: "Error editting pin" };
    }
};
exports.userServices = {
    verifyUser,
    addUser,
    userExists,
    editUser,
    checkPin,
    changePin,
    deleteAccount,
    getUser,
};
