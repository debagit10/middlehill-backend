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
      res.status(401).json({ error: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token not provided" });
      return;
    }

    const decryptedToken = decryptToken(token);
    if (!decryptedToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const payload = jwt.verify(decryptedToken, process.env.JWT_SECRET!) as any;

    if (!payload?.userId) {
      res.status(401).json({ error: "Token verification failed" });
      return;
    }

    //req.user = payload.decode;
    res.locals.user_id = payload.userId;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error authorizing user." });
  }
};

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token not provided" });
      return;
    }

    const decryptedToken = decryptToken(token);
    if (!decryptedToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const payload = jwt.verify(decryptedToken, process.env.JWT_SECRET!) as any;

    if (!payload?.userId) {
      res.status(401).json({ error: "Token verification failed" });
      return;
    }

    //req.user = payload.decode;
    res.locals.admin = payload;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error authorizing user." });
  }
};
