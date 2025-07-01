"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpVerification = exports.forgotPin = exports.changeUserPin = exports.confirmPin = exports.deleteUserAccount = exports.verifyProfileEdit = exports.editProfile = exports.userDetails = exports.signInUser = exports.loginUser = exports.verify = exports.signUpUser = void 0;
const userServices_1 = require("../services/userServices");
const otp_1 = require("../utils/otp");
const pin_1 = require("../utils/pin");
const token_1 = require("../config/token");
const signUpUser = async (req, res) => {
    const registerData = req.body;
    try {
        const userCheck = await userServices_1.userServices.userExists(registerData.phone_number);
        if (userCheck.exists) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        if (userCheck.suspended) {
            res.status(403).json({ error: "Account suspended" });
        }
        if (userCheck.error === "User found but not verified") {
            const otp = otp_1.otpServices.generateOtp();
            await otp_1.otpServices.storeOtp(String(userCheck.user?.id), otp);
            res.status(201).json({
                success: "User signed up successfully",
                data: userCheck.user,
                otp,
            });
            return;
        }
        if (userCheck.error === "Error checking user existence") {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        const response = await userServices_1.userServices.addUser({
            ...registerData,
            suspended: false,
            deleted: false,
        });
        if (response.success) {
            const otp = otp_1.otpServices.generateOtp();
            await otp_1.otpServices.storeOtp(response.data.dataValues.id, otp);
            res.status(201).json({
                success: "User signed up successfully",
                data: response.data,
                otp,
            });
            return;
        }
        res.status(400).json({ error: "Unable to register user" });
        return;
    }
    catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ error: "Error registering user" });
        return;
    }
};
exports.signUpUser = signUpUser;
const verify = async (req, res) => {
    const verifyData = req.body;
    try {
        const verified = await userServices_1.userServices.verifyUser(verifyData.otp, verifyData.id);
        if (!verified?.verified) {
            res
                .status(500)
                .json({ error: "User verification failed", message: verified?.error });
            return;
        }
        const accessToken = (0, token_1.generateAccessToken)({
            userId: verifyData.id,
        });
        const refreshToken = await (0, token_1.generateRefreshToken)({
            userId: verifyData.id,
        });
        res.status(200).json({
            success: "User successfully verified",
            message: verified?.success,
            accessToken: (0, token_1.encryptToken)(accessToken),
            refreshToken: (0, token_1.encryptToken)(refreshToken),
        });
        return;
    }
    catch (error) {
        console.error("Error verifying user", error);
        res.status(500).json({ error: "Error verifying user" });
        return;
    }
};
exports.verify = verify;
const loginUser = async (req, res) => {
    const loginData = req.body;
    try {
        const userExists = await userServices_1.userServices.userExists(loginData.phone_number);
        if (userExists.suspended) {
            res.status(403).json({ error: "Account suspended" });
        }
        if (userExists.error === "User found but not verified") {
            res.status(403).json({ error: "User found but not verified" });
            return;
        }
        if (userExists.error === "Error checking user existence") {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (!userExists.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const checkPin = await (0, pin_1.verifyPin)(loginData.pin, String(userExists.user?.pin));
        if (!checkPin) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        const accessToken = (0, token_1.generateAccessToken)({
            userId: String(userExists.user?.id),
        });
        const refreshToken = await (0, token_1.generateRefreshToken)({
            userId: String(userExists.user?.id),
        });
        res.status(200).json({
            success: "Login successful",
            user: userExists.user,
            accessToken: (0, token_1.encryptToken)(accessToken),
            refreshToken: (0, token_1.encryptToken)(refreshToken),
        });
    }
    catch (error) {
        console.error("Error in user login", error);
        res.status(500).json({ error: "Error logging user in" });
        return;
    }
};
exports.loginUser = loginUser;
const signInUser = async (req, res) => {
    try {
        const signInData = req.body;
        const userExists = await userServices_1.userServices.userExists(signInData.phone_number);
        if (userExists.suspended) {
            res.status(403).json({ error: "Account suspended" });
        }
        if (userExists.error === "User found but not verified") {
            res.status(409).json({ error: "User found but not verified" });
            return;
        }
        if (userExists.error === "Error checking user existence") {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (!userExists.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const checkPin = await (0, pin_1.verifyPin)(signInData.pin, String(userExists.user?.pin));
        if (!checkPin) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(String(userExists.user?.id), otp);
        const accessToken = (0, token_1.generateAccessToken)({
            userId: String(userExists.user?.id),
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            userId: String(userExists.user?.id),
        });
        res.status(200).json({
            success: "Login successful",
            user: userExists.user,
            otp,
        });
    }
    catch (error) {
        console.error("Error signing user in ", error);
        res.status(500).json({ error: "Error - user sign in" });
        return;
    }
};
exports.signInUser = signInUser;
const userDetails = async (req, res) => {
    const user_id = res.locals.user_id;
    try {
        const response = await userServices_1.userServices.getUser(user_id);
        if (response.error === "User not found") {
            res.status(404).json(response);
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.error("Error getting user details ", error);
        res.status(500).json({ error: "Error - get user details" });
        return;
    }
};
exports.userDetails = userDetails;
const editProfile = async (req, res) => {
    const newData = req.body;
    // const { user_id } = req.params;
    const user_id = res.locals.user_id;
    try {
        const checkPin = await (0, pin_1.verifyPin)(newData.pin, newData.hashedPin);
        if (!checkPin) {
            res.status(500).json({ error: "Incorrect password" });
            return;
        }
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(user_id, otp);
        res.status(200).json({ success: "Details saved", otp });
    }
    catch (error) {
        console.error("Error editting user profile ", error);
        res.status(500).json({ error: "Error - edit user profile" });
        return;
    }
};
exports.editProfile = editProfile;
const verifyProfileEdit = async (req, res) => {
    const editData = req.body;
    // const { user_id } = req.params;
    const user_id = res.locals.user_id;
    try {
        const verify = await otp_1.otpServices.verifyOtp(user_id, editData.otp_code);
        if (verify.error) {
            res.status(500).json({ error: verify.error });
            return;
        }
        const editUser = await userServices_1.userServices.editUser(user_id, editData);
        if (editUser.error) {
            res.status(500).json({ error: editUser.error });
            return;
        }
        res.status(200).json({ success: editUser.success });
    }
    catch (error) {
        console.error("Error verifying user profile edit", error);
        res.status(500).json({ error: "Error - user account edit" });
        return;
    }
};
exports.verifyProfileEdit = verifyProfileEdit;
const deleteUserAccount = async (req, res) => {
    const { pin } = req.body;
    const user_id = res.locals.user_id;
    try {
        const { error } = await userServices_1.userServices.checkPin(user_id, pin);
        if (error) {
            res.status(400).json({ error });
            return;
        }
        const response = await userServices_1.userServices.deleteAccount(user_id);
        if (response.error == "Failed to delete account") {
            res.status(500).json({ error: response.error });
            return;
        }
        res.status(200).json({ success: response.success });
    }
    catch (error) {
        console.error("Error deleting account", error);
        res.status(500).json({ error: "Error - delete user account" });
        return;
    }
};
exports.deleteUserAccount = deleteUserAccount;
const confirmPin = async (req, res) => {
    const { pin } = req.body;
    const user_id = res.locals.user_id;
    try {
        const { error, success } = await userServices_1.userServices.checkPin(user_id, pin);
        if (error) {
            res.status(400).json({ error });
            return;
        }
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(user_id, otp);
        res.status(200).json({ success, otp });
    }
    catch (error) {
        console.error("Error confirming pin", error);
        res.status(500).json({ error: "Error - confriming pin" });
    }
};
exports.confirmPin = confirmPin;
const changeUserPin = async (req, res) => {
    const changePinData = req.body;
    const user_id = res.locals.user_id;
    try {
        const verify = await otp_1.otpServices.verifyOtp(user_id, changePinData.otp_code);
        if (verify.error) {
            res.status(500).json({ error: verify.error });
            return;
        }
        const response = await userServices_1.userServices.changePin(user_id, changePinData.newPin);
        if (response.error) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.status(200).json({ success: response.success });
    }
    catch (error) {
        console.error("Error changing pin", error);
        res.status(500).json({ error: "Error - changing user pin" });
        return;
    }
};
exports.changeUserPin = changeUserPin;
const forgotPin = async (req, res) => {
    const { phone_number } = req.body;
    try {
        const { error, exists, suspended, user } = await userServices_1.userServices.userExists(phone_number);
        if (error) {
            res.status(400).json({ error });
            return;
        }
        if (!exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (suspended) {
            res.status(403).json({ error: "Account suspended" });
            return;
        }
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(String(user?.id), otp);
        const accessToken = (0, token_1.generateAccessToken)({
            userId: String(user?.id),
        });
        res.status(200).json({
            success: "OTP sent successfully",
            otp,
            user,
            accessToken: (0, token_1.encryptToken)(accessToken),
        });
    }
    catch (error) {
        console.error("Error in forgot pin", error);
        res.status(500).json({ error: "Error - forgot pin" });
        return;
    }
};
exports.forgotPin = forgotPin;
const otpVerification = async (req, res) => {
    const { otp, id } = req.body;
    try {
        const verify = await otp_1.otpServices.verifyOtp(id, otp);
        if (verify.error) {
            res.status(500).json({ error: verify.error });
            return;
        }
        res.status(200).json({ success: "OTP verified successfully" });
    }
    catch (error) {
        console.error("Error verifying OTP", error);
        res.status(500).json({ error: "Error - verifying OTP" });
        return;
    }
};
exports.otpVerification = otpVerification;
