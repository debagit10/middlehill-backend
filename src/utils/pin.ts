import argon2 from "argon2";

export const hashPin = async (pin: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(pin);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Failed to hash password.");
  }
};

export const verifyPin = async (
  pin: string,
  hashedPin: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPin, pin);
  } catch (err) {
    console.error("Error verifying password:", err);
    throw new Error("Failed to verify password.");
  }
};
