"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_config_1 = require("./config/database_config");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, database_config_1.connectDB)();
    app_1.default.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`));
};
if (require.main === module) {
    startServer();
}
