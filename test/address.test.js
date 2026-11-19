import request from "supertest";
import { app } from "../src/web/main.js";
import {
  createTestAddress,
  createTestContactUser,
  getTestAddress,
  getTestContact,
  removeTestContactUser,
} from "./util-test.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestContactUser();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should create a new address", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl danur wenda 3",
        city: "malang",
        province: "jatim",
        country: "indonesia",
        postal_code: "65362",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.street).toBe("jl danur wenda 3");
    expect(response.body.data.city).toBe("malang");
    expect(response.body.data.province).toBe("jatim");
    expect(response.body.data.country).toBe("indonesia");
    expect(response.body.data.postal_code).toBe("65362");
  });

  it("should reject if request is invalid", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl danur wenda 3",
        city: "malang",
        province: "jatim",
        country: "",
        postal_code: "",
      });

    expect(response.status).toBe(400);
  });

  it("should reject if contact is not found", async () => {
    const response = await request(app)
      .post("/api/contacts/99999/addresses")
      .set("Authorization", "testcontact")
      .send({
        street: "jl danur wenda 3",
        city: "malang",
        province: "jatim",
        country: "indonesia",
        postal_code: "65362",
      });

    expect(response.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should retrieve an address by ID", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.id).toBe(address.id);
    expect(response.body.data.street).toBe("jl danur wenda 3");
    expect(response.body.data.city).toBe("malang");
    expect(response.body.data.province).toBe("jatim");
    expect(response.body.data.country).toBe("indonesia");
    expect(response.body.data.postal_code).toBe("65362");
  });

  it("should reject if address is not found", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .get(`/api/contacts/${contact.id}/addresses/99999`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const address = await getTestAddress();
    const response = await request(app)
      .get(`/api/contacts/99999/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should update an address by ID", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl sudirman",
        city: "jakarta",
        province: "dki jakarta",
        country: "indonesia",
        postal_code: "12345",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.id).toBe(address.id);
    expect(response.body.data.street).toBe("jl sudirman");
    expect(response.body.data.city).toBe("jakarta");
    expect(response.body.data.province).toBe("dki jakarta");
    expect(response.body.data.country).toBe("indonesia");
    expect(response.body.data.postal_code).toBe("12345");
  });

  it("should update an address with optional country and postal code", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl sudirman baru",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.id).toBe(address.id);
    expect(response.body.data.street).toBe("jl sudirman baru");
  });

  it("should reject if request is invalid", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl sudirman",
        city: "jakarta",
        province: "dki jakarta",
        country: "",
        postal_code: "",
      });

    expect(response.status).toBe(400);
  });

  it("should reject if address is not found", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .put(`/api/contacts/${contact.id}/addresses/99999`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl sudirman",
        city: "jakarta",
        province: "dki jakarta",
        country: "indonesia",
        postal_code: "12345",
      });

    expect(response.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const address = await getTestAddress();
    const response = await request(app)
      .put(`/api/contacts/99999/addresses/${address.id}`)
      .set("Authorization", "testcontact")
      .send({
        street: "jl sudirman",
        city: "jakarta",
        province: "dki jakarta",
        country: "indonesia",
        postal_code: "12345",
      });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should remove an address by ID", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const response = await request(app)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(204);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should reject if address is not found", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .delete(`/api/contacts/${contact.id}/addresses/99999`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const address = await getTestAddress();
    const response = await request(app)
      .delete(`/api/contacts/99999/addresses/${address.id}`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestContactUser();
    await createTestAddress();
  }, 15000);

  afterEach(async () => {
    await removeTestContactUser();
  }, 15000);

  it("should list all addresses for contact", async () => {
    const contact = await getTestContact();
    const response = await request(app)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testcontact");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].street).toBe("jl danur wenda 3");
  });

  it("should reject if contact is not found", async () => {
    const response = await request(app)
      .get("/api/contacts/99999/addresses")
      .set("Authorization", "testcontact");

    expect(response.status).toBe(404);
  });
});
