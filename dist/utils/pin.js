"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinServices = exports.verifyPin = exports.hashPin = void 0;
const argon2_1 = __importDefault(require("argon2"));
const hashPin = async (pin) => {
    try {
        const hashedPassword = await argon2_1.default.hash(pin);
        return hashedPassword;
    }
    catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password.");
    }
};
exports.hashPin = hashPin;
const verifyPin = async (pin, hashedPin) => {
    try {
        return await argon2_1.default.verify(hashedPin, pin);
    }
    catch (err) {
        console.error("Error verifying password:", err);
        throw new Error("Failed to verify password.");
    }
};
exports.verifyPin = verifyPin;
exports.pinServices = { hashPin: exports.hashPin, verifyPin: exports.verifyPin };
