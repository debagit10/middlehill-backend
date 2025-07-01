"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const authorizeAdmin = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorizeAdmin = authorizeAdmin;
