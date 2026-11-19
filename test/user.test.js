import request from "supertest";
import { app } from "../src/web/main.js";
import { prismaClient } from "../src/web/database.js";
import { createTestUser, removeTestUser } from "./util-test.js";

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should register a new user", async () => {
    const response = await request(app).post("/api/users").send({
      name: "TESTING",
      username: "test",
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username", "test");
    expect(response.body.data).toHaveProperty("name", "TESTING");
  });

  it("should reject if username is already taken", async () => {
    await prismaClient.user.create({
      data: {
        name: "TESTING",
        username: "test",
        password: "hashedpassword",
      },
    });
    const response = await request(app).post("/api/users").send({
      name: "TESTING",
      username: "test",
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
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login with correct credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      username: "test",
      password: "password123",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.token).not.toBe("test");
  });

  it("should reject login with incorrect credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      username: "test",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });
});

describe("GET /api/users/me", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should retrieve current user information", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username", "test");
  });

  it("should reject if not authenticated", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });
});

describe("PATCH /api/users/me", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should update current user information", async () => {
    const response = await request(app)
      .patch("/api/users/me")
      .set("Authorization", "test")
      .send({
        name: "Updated Name",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("name", "Updated Name");
  });

  it("should reject if not authenticated", async () => {
    const response = await request(app).patch("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should update password", async () => {
    const response = await request(app)
      .patch("/api/users/me")
      .set("Authorization", "test")
      .send({
        password: "newpassword123",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should logout current user", async () => {
    const response = await request(app)
      .delete("/api/users/logout")
      .set("Authorization", "test");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  it("should reject if not authenticated", async () => {
    const response = await request(app).delete("/api/users/logout");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });
});
