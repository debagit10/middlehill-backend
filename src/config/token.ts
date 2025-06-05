import jwt, { SignOptions } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { Token } from "../models/tokenModel";

dotenv.config();

interface TokenPayload {
  userId: string;
  role?: string;
}

const generateAccessToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "15m", // Default expiration time
  };

  if (!secret || !expiresIn) {
    throw new Error(
      "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined"
    );
  }

  return jwt.sign(payload, secret, options);
};

const generateRefreshToken = async (payload: TokenPayload) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "7d",
  };

  if (!secret || !expiresIn) {
    throw new Error(
      "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined"
    );
  }

  const token = jwt.sign(payload, secret, options);

  await Token.create({
    user_id: payload.userId,
    token: token,
  });

  return token;
};

const encryptToken = (token: string) => {
  const secretKey = process.env.CRYPTO_SECRET_KEY;

  if (!token) {
    console.error("Encryption key is missing!");
    throw new Error("Encryption key is missing");
  }

  try {
    if (secretKey) {
      const cipherText = CryptoJS.AES.encrypt(token, secretKey).toString();
      return cipherText;
    }
  } catch (error) {
    console.error("Encryption error:", error);
    return { error: "Server error" };
  }
};

const decryptToken = (encryptedToken: string): string | null => {
  const secretKey = process.env.CRYPTO_SECRET_KEY;

  if (!secretKey) {
    console.error("Decryption key is missing!");
    return null;
  }
  try {
    const decodedToken = decodeURIComponent(encryptedToken);

    const bytes = CryptoJS.AES.decrypt(decodedToken, secretKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedToken || null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  encryptToken,
  decryptToken,
};
