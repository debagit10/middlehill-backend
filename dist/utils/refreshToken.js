"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenModel_1 = require("../models/tokenModel");
const token_1 = require("../config/token");
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_SECRET = process.env.JWT_SECRET;
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log({ refreshToken });
    const decryptedToken = String((0, token_1.decryptToken)(refreshToken));
    const tokenExists = await tokenModel_1.Token.findOne({
        where: { token: decryptedToken },
        attributes: ["token"],
    });
    try {
        if (!tokenExists) {
            res.status(403).json({ message: "Refresh token not found" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(decryptedToken, String(REFRESH_SECRET));
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.userId }, String(ACCESS_SECRET), {
            expiresIn: "15m",
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: decoded.userId }, String(REFRESH_SECRET), {
            expiresIn: "7d",
        });
        // Replace old refresh token
        await tokenModel_1.Token.create({
            user_id: decoded.userId,
            token: newRefreshToken,
        });
        res.cookie("refreshToken", (0, token_1.encryptToken)(newRefreshToken), {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            accessToken: (0, token_1.encryptToken)(newAccessToken),
        });
        return;
    }
    catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
    }
};
exports.refreshToken = refreshToken;
