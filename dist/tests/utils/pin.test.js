"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pin_1 = require("../../utils/pin");
const argon2_1 = __importDefault(require("argon2"));
jest.mock("argon2");
describe("hash pin", () => {
    it("should return a hashed pin", async () => {
        const pin = "1234";
        const mockedPin = "hashedPin1234";
        argon2_1.default.hash = jest.fn().mockResolvedValue(mockedPin);
        const result = await pin_1.pinServices.hashPin(pin);
        expect(result).toBe(mockedPin);
        expect(argon2_1.default.hash).toHaveBeenCalledWith(pin);
    });
    it("should return error if hashing failed", async () => {
        const pin = "1234";
        argon2_1.default.hash = jest.fn().mockRejectedValue(new Error("Hashing failed"));
        await expect(pin_1.pinServices.hashPin(pin)).rejects.toThrow("Failed to hash password");
    });
});
describe("verify pin", () => {
    it("should verify and return a boolean", async () => {
        const pin = "1234";
        const hashedPin = "hashedPin1234";
        argon2_1.default.verify = jest.fn().mockResolvedValue(true);
        const result = await pin_1.pinServices.verifyPin(pin, hashedPin);
        expect(result).toBe(true);
        expect(argon2_1.default.verify).toHaveBeenCalledWith(hashedPin, pin);
    });
    it("should return false if the pin is incorrect", async () => {
        const pin = "1234";
        const hashedPin = "hashedPin1234";
        // Mock the verify function to return false
        argon2_1.default.verify = jest.fn().mockResolvedValue(false);
        const result = await pin_1.pinServices.verifyPin(pin, hashedPin);
        expect(result).toBe(false);
    });
    it("should return error if verification failed", async () => {
        const pin = "1234";
        const hashedPin = "hashedPin1234";
        argon2_1.default.verify = jest
            .fn()
            .mockRejectedValue(new Error("Verification failed"));
        await expect(pin_1.pinServices.verifyPin(pin, hashedPin)).rejects.toThrow("Failed to verify password.");
    });
});
