"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const authorizeAdmin = (...allowedRoles) => {
    return (req, res, next) => {
        const loggedIn = res.locals.admin;
        if (!allowedRoles.includes(loggedIn.role)) {
            return res
                .status(403)
                .json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};
exports.authorizeAdmin = authorizeAdmin;
