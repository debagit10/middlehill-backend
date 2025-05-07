import { pinServices } from "../../utils/pin";
import argon2 from "argon2";

jest.mock("argon2");

describe("hash pin", () => {
  it("should return a hashed pin", async () => {
    const pin = "1234";
    const mockedPin = "hashedPin1234";

    argon2.hash = jest.fn().mockResolvedValue(mockedPin);

    const result = await pinServices.hashPin(pin);

    expect(result).toBe(mockedPin);
    expect(argon2.hash).toHaveBeenCalledWith(pin);
  });

  it("should return error if hashing failed", async () => {
    const pin = "1234";

    argon2.hash = jest.fn().mockRejectedValue(new Error("Hashing failed"));

    await expect(pinServices.hashPin(pin)).rejects.toThrow(
      "Failed to hash password"
    );
  });
});
