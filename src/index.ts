import app from "./app";
import { connectDB } from "./config/database_config";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`)
  );
};

if (require.main === module) {
  startServer();
}
