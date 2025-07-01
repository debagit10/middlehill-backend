"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = require("./routes/userRoutes");
const transactionRoutes_1 = require("./routes/transactionRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const resendOtp_1 = require("./utils/resendOtp");
const refreshToken_1 = require("./utils/refreshToken");
const businessRoutes_1 = require("./routes/businessRoutes");
const statementRoutes_1 = require("./routes/statementRoutes");
require("./models/relationships");
const mono_1 = require("./utils/mono");
const authorize_1 = require("./middlewares/authorize");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (_req, res) => {
    res.status(200).json({ message: "Middle Hill backend server live" });
});
app.use("/api/user", userRoutes_1.userRouter);
app.use("/api/transaction", transactionRoutes_1.transactionRouter);
app.use("/api/admin", adminRoutes_1.adminRouter);
app.use("/api/business", businessRoutes_1.businessRouter);
app.use("/api/statement", statementRoutes_1.statementRouter);
app.post("/api/otp/resend/:user_id", resendOtp_1.resendOtp);
app.post("/api/refreshToken", refreshToken_1.refreshToken);
app.post("/api/connect-mono", authorize_1.authUser, mono_1.connectMono);
exports.default = app;
