import request from "supertest";
import { app } from "../src/web/main.js";
import { prismaClient } from "../src/web/database.js";

describe("POST /api/users", () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "johndoe",
      },
    });
  });
  it("should register a new user", async () => {
    const response = await request(app).post("/api/users").send({
      name: "John Doe",
      username: "johndoe",
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username", "johndoe");
    expect(response.body.data).toHaveProperty("name", "John Doe");
  });
  it("should reject if username is already taken", async () => {
    await prismaClient.user.create({
      data: {
        name: "John Doe",
        username: "johndoe",
        password: "hashedpassword",
      },
    });
    const response = await request(app).post("/api/users").send({
      name: "John Doe",
      username: "johndoe",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
  it("should reject if request is invalid", async () => {
    const response = await request(app).post("/api/users").send({
      name: "",
      username: "",
      password: "",
    });
    console.log("STATUS:", response.status);
    console.log("BODY:", JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
