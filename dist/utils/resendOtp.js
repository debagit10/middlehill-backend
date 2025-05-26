"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = void 0;
const otp_1 = require("./otp");
const resendOtp = async (req, res) => {
    const { user_id } = req.params;
    try {
        const otp = otp_1.otpServices.generateOtp();
        await otp_1.otpServices.storeOtp(user_id, otp);
        res.status(200).json({ success: "Otp resent", otp });
    }
    catch (error) {
        console.error("Error resending otp:", error);
        res.status(500).json({ error: "Error resending otp" });
    }
};
exports.resendOtp = resendOtp;
