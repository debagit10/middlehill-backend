import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/database_config";

import { userRouter } from "./routes/userRoutes";
import { transactionRouter } from "./routes/transactionRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (res: Response) => {
  res.status(200).send("Middle Hill backend server live");
});

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`)
  );
};

startServer();
