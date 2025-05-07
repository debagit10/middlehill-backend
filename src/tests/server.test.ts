import app from "../app";
import request from "supertest";

describe("GET /", () => {
  it("should start the backend server", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Middle Hill backend server live");
  });
});
