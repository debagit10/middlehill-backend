"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2_1.default.hash(password);
        return hashedPassword;
    }
    catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password.");
    }
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hashedPassword) => {
    try {
        return await argon2_1.default.verify(hashedPassword, password);
    }
    catch (err) {
        console.error("Error verifying password:", err);
        throw new Error("Failed to verify password.");
    }
};
exports.verifyPassword = verifyPassword;
