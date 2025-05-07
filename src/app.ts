import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database_config";
import { userRouter } from "./routes/userRoutes";
import { transactionRouter } from "./routes/transactionRoutes";
import { resendOtp } from "./utils/resendOtp";
import { Request, Response } from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Middle Hill backend server live" });
});

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.post("/api/otp/resend/:user_id", resendOtp);

export default app;
