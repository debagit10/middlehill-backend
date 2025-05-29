import { Request, Response, NextFunction } from "express";

export const authorizeAdmin = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const loggedIn = res.locals.admin;

    if (!allowedRoles.includes(loggedIn.role)) {
      res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
      return;
    }
    next();
  };
};
