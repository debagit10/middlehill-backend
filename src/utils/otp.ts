import otpGenerator from "otp-generator";
import { OTP } from "../models/otpModel";

const generateOtp = () => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return otp;
};

const storeOtp = async (user_id: string, otp_code: string) => {
  const expiresIn = 5 * 60 * 1000; // OTP expires in 5 minutes
  const expiresAt = new Date(Date.now() + expiresIn);

  await OTP.create({ user_id, otp_code, expiresAt });
};

const verifyOtp = async (user_id: string, otp_code: string) => {
  const otpEntry = await OTP.findOne({
    where: { user_id, otp_code },
  });

  if (otpEntry?.dataValues.used) {
    return { error: "OTP expired" };
  }

  if (otpEntry) {
    if (new Date() > otpEntry.dataValues?.expiresAt) {
      return { error: "OTP expired" };
    }
  } else {
    return { error: "Invalid OTP" };
  }

  return { success: "Account verified" };
};

export const otpServices = { generateOtp, storeOtp, verifyOtp };
