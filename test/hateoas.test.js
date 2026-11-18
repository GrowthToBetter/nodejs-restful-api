import request from "supertest";
import { app } from "../src/web/main.js";
import {
  createTestAddress,
  createTestContactUser,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeTestContactUser,
  removeTestUser,
} from "./util-test.js";

describe("HATEOAS Navigation Links", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    await removeTestUser();
  }, 15000);

  it("should return HATEOAS links on GET /api/users/me", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "test");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("_links");
    expect(response.body.data._links).toHaveProperty("self");
    expect(response.body.data._links.self.href).toBe("/api/users/me");
    expect(response.body.data._links).toHaveProperty("update");
    expect(response.body.data._links).toHaveProperty("logout");
    expect(response.body.data._links).toHaveProperty("contacts");
  });

  it("should return HATEOAS links on GET /api/contacts/:id", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("_links");
    expect(response.body.data._links.self.href).toBe(`/api/contacts/${contact.id}`);
    expect(response.body.data._links).toHaveProperty("update");
    expect(response.body.data._links).toHaveProperty("delete");
    expect(response.body.data._links).toHaveProperty("addresses");
    expect(response.body.data._links).toHaveProperty("create_address");
  });

  it("should return HATEOAS links on GET /api/contacts search collection", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .set("Authorization", "testcontact");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_links");
    expect(response.body._links).toHaveProperty("self");
    expect(response.body._links).toHaveProperty("first");
    expect(response.body._links).toHaveProperty("last");
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty("_links");
    expect(response.body.data[0]._links).toHaveProperty("self");
  });

  it("should return HATEOAS links on GET /api/contacts/:contactId/addresses/:addressId", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("_links");
    expect(response.body.data._links.self.href).toBe(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
    );
    expect(response.body.data._links).toHaveProperty("update");
    expect(response.body.data._links).toHaveProperty("delete");
    expect(response.body.data._links).toHaveProperty("contact");
  });
});
