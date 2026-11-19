import request from "supertest";
import { app } from "../src/web/main.js";
import {
  createManyTestContact,
  createTestContactUser,
  removeTestContactUser,
  removeTestUser,
} from "./util-test.js";
import { prismaClient } from "../src/web/database.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should create a new contact", async () => {
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", "testcontact")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.first_name).toBe("John");
    expect(response.body.data.last_name).toBe("Doe");
    expect(response.body.data.email).toBe("john.doe@example.com");
    expect(response.body.data.phone).toBe("1234567890");
  });

  it("should reject if request is invalid", async () => {
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", "testcontact")
      .send({ first_name: "", last_name: "Doe" });
    expect(response.status).toBe(400);
  });
});

describe("GET /api/contacts/:id", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    await removeTestUser();
  }, 15000);

  it("should retrieve a contact by ID", async () => {
    const contact = await prismaClient.contact.findFirst({
      where: { username: "testcontact" },
    });
    const response = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.first_name).toBe("John");
  });

  it("should reject if request is invalid", async () => {
    const response = await request(app)
      .get("/api/contacts/99999")
      .set("Authorization", "testcontact");
    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/contacts/:id", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    await removeTestUser();
  }, 15000);

  it("should update a contact by ID", async () => {
    const contact = await prismaClient.contact.findFirst({
      where: { username: "testcontact" },
    });
    const response = await request(app)
      .patch(`/api/contacts/${contact.id}`)
      .send({
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "0987654321",
      })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.first_name).toBe("Jane");
    expect(response.body.data.last_name).toBe("Smith");
    expect(response.body.data.email).toBe("jane.smith@example.com");
    expect(response.body.data.phone).toBe("0987654321");
  });

  it("should reject if request is invalid", async () => {
    const response = await request(app)
      .patch("/api/contacts/99999")
      .send({
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "0987654321",
      })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:id", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    await removeTestUser();
  }, 15000);

  it("should remove a contact by ID", async () => {
    const contact = await prismaClient.contact.findFirst({
      where: { username: "testcontact" },
    });
    const response = await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");
    expect(response.status).toBe(204);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should reject if request is invalid", async () => {
    const response = await request(app)
      .delete("/api/contacts/99999")
      .set("Authorization", "testcontact");
    expect(response.status).toBe(404);
  });
});

describe("GET /api/contacts/", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createManyTestContact();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    
  }, 15000);

  it("should can search without params", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.length).toBe(10); 
    expect(response.body).toHaveProperty("paging");
    expect(response.body.paging.total_items).toBe(15);
    expect(response.body.paging.total_page).toBe(2);
    expect(response.body.paging.page).toBe(1);
  });

  it("should can search with name", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .query({ name: "test 1" })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should can search with email", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .query({ email: "test1@gmail.com" })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should can search with phone", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .query({ phone: "0188282831" })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should can search with page 2", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .query({ page: 2 })
      .set("Authorization", "testcontact");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.paging.page).toBe(2);
  });
});
