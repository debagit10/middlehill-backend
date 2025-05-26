import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../models/tokenModel";
import { decryptToken, encryptToken } from "../config/token";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_SECRET = process.env.JWT_SECRET;

interface TokenPayload extends JwtPayload {
  id: string;
}

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const decryptedToken = String(decryptToken(refreshToken));

  const tokenExists = await Token.findOne({
    where: { token: decryptedToken },
    attributes: ["token"],
  });

  try {
    if (!tokenExists) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = jwt.verify(
      decryptedToken,
      String(REFRESH_SECRET)
    ) as TokenPayload;

    const newAccessToken = jwt.sign(
      { id: decoded.userId },
      String(ACCESS_SECRET),
      {
        expiresIn: "15m",
      }
    );
    const newRefreshToken = jwt.sign(
      { id: decoded.userId },
      String(REFRESH_SECRET),
      {
        expiresIn: "7d",
      }
    );

    // Replace old refresh token
    await Token.create({
      user_id: decoded.userId,
      token: newRefreshToken,
    });

    res.json({
      accessToken: encryptToken(newAccessToken),
      refreshToken: encryptToken(newRefreshToken),
    });
    return;
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }
};
