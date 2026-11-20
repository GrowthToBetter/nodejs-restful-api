import request from "supertest";
import { app } from "../src/web/main.js";

describe("Swagger OpenAPI Documentation", () => {
  it("should serve OpenAPI specification JSON at /api-docs.json", async () => {
    const response = await request(app).get("/api-docs.json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("openapi", "3.0.0");
    expect(response.body).toHaveProperty("info");
    expect(response.body.info).toHaveProperty("title", "Node RESTful API");
    expect(response.body).toHaveProperty("paths");
    expect(response.body.paths).toHaveProperty("/api/users");
    expect(response.body.paths).toHaveProperty("/api/users/login");
    expect(response.body.paths).toHaveProperty("/api/users/me");
    expect(response.body.paths).toHaveProperty("/api/users/logout");
    expect(response.body.paths).toHaveProperty("/api/contacts");
    expect(response.body.paths).toHaveProperty("/api/contacts/{id}");
    expect(response.body.paths).toHaveProperty("/api/contacts/{contactId}/addresses");
    expect(response.body.paths).toHaveProperty("/api/contacts/{contactId}/addresses/{addressId}");
    expect(response.body).toHaveProperty("components");
    expect(response.body.components).toHaveProperty("securitySchemes");
    expect(response.body.components.securitySchemes).toHaveProperty("ApiKeyAuth");
  });

  it("should serve Swagger UI at /api-docs", async () => {
    const response = await request(app).get("/api-docs/");

    expect([200, 301]).toContain(response.status);
    if (response.status === 200) {
      expect(response.text).toContain("swagger-ui");
    }
  });

  it("should document 200, 400, 401, 500 schemas across endpoints", async () => {
    const response = await request(app).get("/api-docs.json");
    expect(response.status).toBe(200);

    const schemas = response.body.components.schemas;
    expect(schemas).toHaveProperty("ErrorResponse400");
    expect(schemas).toHaveProperty("ErrorResponse401");
    expect(schemas).toHaveProperty("ErrorResponse404");
    expect(schemas).toHaveProperty("ErrorResponse500");
  });
});
