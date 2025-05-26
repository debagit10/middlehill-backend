import { Request, Response, NextFunction } from "express";
import { decryptToken } from "../config/token";
import jwt from "jsonwebtoken";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decryptedToken = decryptToken(token);
    if (!decryptedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const payload = jwt.verify(decryptedToken, process.env.JWT_SECRET!) as any;

    console.log("Payload:", payload);

    if (!payload?.valid) {
      return res.status(401).json({ error: "Token verification failed" });
    }

    //req.user = payload.decode;
    res.locals.user = payload.decode;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error authorizing user." });
  }
};
