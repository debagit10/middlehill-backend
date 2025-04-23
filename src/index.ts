import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/database_config";

import { userRouter } from "./routes/userRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Middle Hill backend server live");
});

app.use("/api/user", userRouter);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`)
  );
};

startServer();
