"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.storeOtp = exports.generateOtp = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const otpModel_1 = require("../models/otpModel");
const generateOtp = () => {
    const otp = otp_generator_1.default.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    return otp;
};
exports.generateOtp = generateOtp;
const storeOtp = async (user_id, otp_code) => {
    const expiresIn = 5 * 60 * 1000; // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + expiresIn);
    await otpModel_1.OTP.create({ user_id, otp_code, expiresAt });
};
exports.storeOtp = storeOtp;
const verifyOtp = async (user_id, otp_code) => {
    const otpEntry = await otpModel_1.OTP.findOne({
        where: { user_id, otp_code },
    });
    if (otpEntry?.dataValues.used) {
        return { error: "OTP expired" };
    }
    if (otpEntry) {
        if (new Date() > otpEntry.dataValues?.expiresAt) {
            return { error: "OTP expired" };
        }
    }
    else {
        return { error: "Invalid OTP" };
    }
    return { success: "Account verified" };
};
exports.verifyOtp = verifyOtp;
