import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/userRoutes";
import { transactionRouter } from "./routes/transactionRoutes";
import { adminRouter } from "./routes/adminRoutes";
import { resendOtp } from "./utils/resendOtp";
import { Request, Response } from "express";
import { refreshToken } from "./utils/refreshToken";
import { businessRouter } from "./routes/businessRoutes";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Middle Hill backend server live" });
});

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/business", businessRouter);

app.post("/api/otp/resend/:user_id", resendOtp);
app.post("/api/refreshToken", refreshToken);

export default app;
