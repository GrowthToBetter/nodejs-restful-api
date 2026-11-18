import request from "supertest";
import { app } from "../src/web/main.js";
import { redisClient } from "../src/web/redis.js";
import redisStructuresService from "../src/service/redis-structures.service.js";
import {
  createTestContactUser,
  createTestUser,
  getTestContact,
  removeTestContactUser,
  removeTestUser,
} from "./util-test.js";

describe("Redis Rate Limiting", () => {
  it("should set rate limit headers on requests", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.headers).toHaveProperty("x-ratelimit-limit");
    expect(response.headers).toHaveProperty("x-ratelimit-remaining");
    expect(response.headers).toHaveProperty("x-ratelimit-reset");
  });

  it("should reject with 429 when rate limit is exceeded", async () => {
    const key = "rate_limit:127.0.0.1";
    await redisClient.set(key, "100", "EX", 60);

    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty("errors");
    await redisClient.del(key);
  });
});

describe("Redis Session & Token Blacklist", () => {
  beforeEach(async () => {
    await createTestUser();
  }, 15000);

  afterEach(async () => {
    await removeTestUser();
  }, 15000);

  it("should store session in redis on login and authenticate via redis", async () => {
    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "password123",
      });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.data.token;

    const sessionUsername = await redisClient.get(`session:${token}`);
    expect(sessionUsername).toBe("test");

    const meResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", token);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.username).toBe("test");
  }, 15000);

  it("should blacklist token and delete session on logout", async () => {
    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "password123",
      });

    const token = loginResponse.body.data.token;

    const logoutResponse = await request(app)
      .post("/api/users/logout")
      .set("Authorization", token);

    expect(logoutResponse.status).toBe(200);

    const sessionAfter = await redisClient.get(`session:${token}`);
    expect(sessionAfter).toBeNull();

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    expect(isBlacklisted).toBe("true");

    const rejectedResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", token);

    expect(rejectedResponse.status).toBe(401);
  }, 15000);
});

describe("Redis Cache Hit/Miss - GET user", () => {
  beforeEach(async () => {
    await createTestUser();
  }, 15000);

  afterEach(async () => {
    await removeTestUser();
  }, 15000);

  it("should return MISS on first request and HIT on second request", async () => {
    const firstResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers["x-cache"]).toBe("MISS");

    const secondResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers["x-cache"]).toBe("HIT");
    expect(secondResponse.body.data.username).toBe(firstResponse.body.data.username);
  }, 15000);

  it("should invalidate user cache on PATCH /api/users", async () => {
    await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");

    const updateResponse = await request(app)
      .patch("/api/users")
      .set("Authorization", "test")
      .send({
        name: "Updated Name",
        username: "test",
      });

    expect(updateResponse.status).toBe(200);

    const thirdResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");

    expect(thirdResponse.status).toBe(200);
    expect(thirdResponse.headers["x-cache"]).toBe("MISS");
    expect(thirdResponse.body.data.name).toBe("Updated Name");
  }, 15000);
});

describe("Redis Cache Hit/Miss - GET contact", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should return MISS on first request and HIT on second request", async () => {
    const contact = await getTestContact();

    const firstResponse = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers["x-cache"]).toBe("MISS");

    const secondResponse = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers["x-cache"]).toBe("HIT");
    expect(secondResponse.body.data.id).toBe(contact.id);
  }, 15000);

  it("should invalidate contact cache on PATCH /api/contacts/:id", async () => {
    const contact = await getTestContact();

    await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    const updateResponse = await request(app)
      .patch(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact")
      .send({
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "0987654321",
      });

    expect(updateResponse.status).toBe(200);

    const afterUpdateResponse = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(afterUpdateResponse.status).toBe(200);
    expect(afterUpdateResponse.headers["x-cache"]).toBe("MISS");
    expect(afterUpdateResponse.body.data.first_name).toBe("Jane");
  }, 15000);

  it("should invalidate contact cache on DELETE /api/contacts/:id", async () => {
    const contact = await getTestContact();

    await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    const deleteResponse = await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(deleteResponse.status).toBe(204);

    const cacheKey = `contact:testcontact:${contact.id}`;
    const cacheAfter = await redisClient.get(cacheKey);
    expect(cacheAfter).toBeNull();
  }, 15000);
});

describe("Redis Data Structures Exploration", () => {
  const testKey = "test_explore:";

  afterEach(async () => {
    const keys = await redisClient.keys(`${testKey}*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  });

  it("should support String operations", async () => {
    const key = `${testKey}string`;
    await redisStructuresService.setString(key, "hello", 10);
    const value = await redisStructuresService.getString(key);
    expect(value).toBe("hello");

    const counterKey = `${testKey}counter`;
    await redisStructuresService.setString(counterKey, "5");
    const incremented = await redisStructuresService.incrString(counterKey);
    expect(incremented).toBe(6);
  });

  it("should support Hash operations", async () => {
    const key = `${testKey}hash`;
    await redisStructuresService.setHash(key, "name", "John");
    await redisStructuresService.setHash(key, "role", "admin");

    const name = await redisStructuresService.getHash(key, "name");
    expect(name).toBe("John");

    const all = await redisStructuresService.getAllHash(key);
    expect(all).toEqual({ name: "John", role: "admin" });
  });

  it("should support List operations", async () => {
    const key = `${testKey}list`;
    await redisStructuresService.pushToList(key, "item1", "item2", "item3");

    const range = await redisStructuresService.getListRange(key, 0, -1);
    expect(range).toEqual(["item1", "item2", "item3"]);

    const popped = await redisStructuresService.popFromList(key);
    expect(popped).toBe("item1");
  });

  it("should support Set operations", async () => {
    const key = `${testKey}set`;
    await redisStructuresService.addToSet(key, "apple", "banana", "cherry", "apple");

    const isMember = await redisStructuresService.isMemberOfSet(key, "banana");
    expect(isMember).toBe(true);

    const isNotMember = await redisStructuresService.isMemberOfSet(key, "orange");
    expect(isNotMember).toBe(false);

    const members = await redisStructuresService.getSetMembers(key);
    expect(members.length).toBe(3);

    await redisStructuresService.removeFromSet(key, "banana");
    const isMemberAfter = await redisStructuresService.isMemberOfSet(key, "banana");
    expect(isMemberAfter).toBe(false);
  });

  it("should support Sorted Set operations", async () => {
    const key = `${testKey}sortedset`;
    await redisStructuresService.addToSortedSet(key, 100, "player1");
    await redisStructuresService.addToSortedSet(key, 250, "player2");
    await redisStructuresService.addToSortedSet(key, 175, "player3");

    const ranking = await redisStructuresService.getSortedSetRange(key, 0, -1);
    expect(ranking).toEqual(["player1", "player3", "player2"]);

    const score = await redisStructuresService.getSortedSetScore(key, "player2");
    expect(score).toBe("250");
  });
});
