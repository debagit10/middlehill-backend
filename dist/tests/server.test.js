"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
describe("GET /", () => {
    it("should start the backend server", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Middle Hill backend server live");
    });
});
