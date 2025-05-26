"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const transactionRoutes_1 = require("./routes/transactionRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const resendOtp_1 = require("./utils/resendOtp");
const refreshToken_1 = require("./utils/refreshToken");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.status(200).json({ message: "Middle Hill backend server live" });
});
app.use("/api/user", userRoutes_1.userRouter);
app.use("/api/transaction", transactionRoutes_1.transactionRouter);
app.use("/api/admin", adminRoutes_1.adminRouter);
app.post("/api/otp/resend/:user_id", resendOtp_1.resendOtp);
app.post("/api/refreshToken", refreshToken_1.refreshToken);
exports.default = app;
