import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Failed to hash password.");
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (err) {
    console.error("Error verifying password:", err);
    throw new Error("Failed to verify password.");
  }
};
