"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptToken = exports.encryptToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const tokenModel_1 = require("../models/tokenModel");
dotenv_1.default.config();
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;
    const options = {
        algorithm: "HS256",
        expiresIn: "1h", // Default expiration time
    };
    if (!secret || !expiresIn) {
        throw new Error("JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (payload) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;
    const options = {
        algorithm: "HS256",
        expiresIn: "7d",
    };
    if (!secret || !expiresIn) {
        throw new Error("JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
    }
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    await tokenModel_1.Token.create({
        user_id: payload.userId,
        token: token,
    });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
const encryptToken = (token) => {
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    if (!token) {
        console.error("Encryption key is missing!");
        throw new Error("Encryption key is missing");
    }
    try {
        if (secretKey) {
            const cipherText = crypto_js_1.default.AES.encrypt(token, secretKey).toString();
            return cipherText;
        }
    }
    catch (error) {
        console.error("Encryption error:", error);
        return { error: "Server error" };
    }
};
exports.encryptToken = encryptToken;
const decryptToken = (encryptedToken) => {
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    if (!secretKey) {
        console.error("Decryption key is missing!");
        return null;
    }
    try {
        const decodedToken = decodeURIComponent(encryptedToken);
        const bytes = crypto_js_1.default.AES.decrypt(decodedToken, secretKey);
        const decryptedToken = bytes.toString(crypto_js_1.default.enc.Utf8);
        return decryptedToken || null;
    }
    catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};
exports.decryptToken = decryptToken;
