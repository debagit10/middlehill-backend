"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const token_1 = require("../config/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = async (req, res, next) => {
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
        const decryptedToken = (0, token_1.decryptToken)(token);
        if (!decryptedToken) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(decryptedToken, process.env.JWT_SECRET);
        if (!payload?.userId) {
            res.status(401).json({ error: "Token verification failed" });
            return;
        }
        //req.user = payload.decode;
        res.locals.user_id = payload.userId;
        next(); // Proceed to the next middleware
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error authorizing user." });
    }
};
exports.authUser = authUser;
