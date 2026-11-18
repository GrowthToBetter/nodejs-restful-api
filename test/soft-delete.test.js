import request from "supertest";
import { app } from "../src/web/main.js";
import { prismaClient } from "../src/web/database.js";
import {
  createTestAddress,
  createTestContactUser,
  getTestAddress,
  getTestContact,
  removeTestContactUser,
  removeTestUser,
} from "./util-test.js";

describe("Soft Delete Pattern", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
    await removeTestUser();
  }, 15000);

  it("should soft delete contact without removing record from database", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(204);

    const dbContact = await prismaClient.contact.findFirst({
      where: { id: contact.id },
    });
    expect(dbContact).not.toBeNull();
    expect(dbContact.deleted_at).not.toBeNull();

    const getResponse = await request(app)
      .get(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");
    expect(getResponse.status).toBe(404);
  });

  it("should exclude soft-deleted contacts from search results", async () => {
    const contact = await getTestContact();
    await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    const searchResponse = await request(app)
      .get("/api/contacts")
      .set("Authorization", "testcontact");

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.data.length).toBe(0);
    expect(searchResponse.body.paging.total_items).toBe(0);
  });

  it("should cascade soft delete to related addresses when contact is deleted", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    await request(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("Authorization", "testcontact");

    const dbAddress = await prismaClient.address.findFirst({
      where: { id: address.id },
    });
    expect(dbAddress).not.toBeNull();
    expect(dbAddress.deleted_at).not.toBeNull();

    const getAddressResponse = await request(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");
    expect(getAddressResponse.status).toBe(404);
  });

  it("should soft delete address without removing record from database", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const response = await request(app)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(204);

    const dbAddress = await prismaClient.address.findFirst({
      where: { id: address.id },
    });
    expect(dbAddress).not.toBeNull();
    expect(dbAddress.deleted_at).not.toBeNull();

    const getAddressResponse = await request(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");
    expect(getAddressResponse.status).toBe(404);

    const listResponse = await request(app)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testcontact");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.length).toBe(0);
  });
});
