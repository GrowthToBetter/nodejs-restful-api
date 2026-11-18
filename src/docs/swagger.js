export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Node RESTful API with Redis",
    version: "1.0.0",
    description: "RESTful API with Redis Caching, Rate Limiting, Session Storage, Token Blacklist, HATEOAS, and Soft Delete",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
    schemas: {
      UserRegisterRequest: {
        type: "object",
        required: ["username", "password", "name"],
        properties: {
          username: { type: "string", example: "john_doe" },
          password: { type: "string", example: "secret123" },
          name: { type: "string", example: "John Doe" },
        },
      },
      UserLoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "john_doe" },
          password: { type: "string", example: "secret123" },
        },
      },
      UserUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "John Doe Updated" },
          password: { type: "string", example: "newpassword123" },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              username: { type: "string" },
              name: { type: "string" },
              _links: { type: "object" },
            },
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
        },
      },
      ContactCreateRequest: {
        type: "object",
        required: ["first_name"],
        properties: {
          first_name: { type: "string", example: "John" },
          last_name: { type: "string", example: "Doe" },
          email: { type: "string", example: "john@example.com" },
          phone: { type: "string", example: "08123456789" },
        },
      },
      ContactUpdateRequest: {
        type: "object",
        properties: {
          first_name: { type: "string", example: "Jane" },
          last_name: { type: "string", example: "Smith" },
          email: { type: "string", example: "jane@example.com" },
          phone: { type: "string", example: "08987654321" },
        },
      },
      ContactResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "integer" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              _links: { type: "object" },
            },
          },
        },
      },
      ContactSearchResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/ContactResponse/properties/data" },
          },
          paging: {
            type: "object",
            properties: {
              page: { type: "integer" },
              total_items: { type: "integer" },
              total_page: { type: "integer" },
            },
          },
          _links: { type: "object" },
        },
      },
      AddressCreateRequest: {
        type: "object",
        required: ["country", "postal_code"],
        properties: {
          street: { type: "string", example: "Jl. Sudirman No. 1" },
          city: { type: "string", example: "Jakarta" },
          province: { type: "string", example: "DKI Jakarta" },
          country: { type: "string", example: "Indonesia" },
          postal_code: { type: "string", example: "12345" },
        },
      },
      AddressUpdateRequest: {
        type: "object",
        required: ["country", "postal_code"],
        properties: {
          street: { type: "string", example: "Jl. Gatot Subroto No. 2" },
          city: { type: "string", example: "Jakarta" },
          province: { type: "string", example: "DKI Jakarta" },
          country: { type: "string", example: "Indonesia" },
          postal_code: { type: "string", example: "54321" },
        },
      },
      AddressResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "integer" },
              street: { type: "string" },
              city: { type: "string" },
              province: { type: "string" },
              country: { type: "string" },
              postal_code: { type: "string" },
              _links: { type: "object" },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          errors: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      post: {
        summary: "Register new user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserRegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        summary: "Update current user",
        tags: ["Users"],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/users/login": {
      post: {
        summary: "Login user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserLoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/users/me": {
      get: {
        summary: "Get current user profile (cached in Redis)",
        tags: ["Users"],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: "Current user profile",
            headers: {
              "X-Cache": {
                schema: { type: "string", example: "HIT" },
                description: "Redis cache status (HIT or MISS)",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/users/logout": {
      post: {
        summary: "Logout user (invalidates session and blacklists token in Redis)",
        tags: ["Users"],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: { description: "Logout successful" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/contacts": {
      post: {
        summary: "Create new contact",
        tags: ["Contacts"],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Contact created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactResponse" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
      get: {
        summary: "Search contacts (excludes soft-deleted contacts)",
        tags: ["Contacts"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "name", in: "query", schema: { type: "string" } },
          { name: "email", in: "query", schema: { type: "string" } },
          { name: "phone", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "size", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            description: "Contact list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactSearchResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/contacts/{id}": {
      get: {
        summary: "Get contact by ID (cached in Redis)",
        tags: ["Contacts"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Contact found",
            headers: {
              "X-Cache": {
                schema: { type: "string", example: "HIT" },
                description: "Redis cache status (HIT or MISS)",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Contact not found or soft-deleted" },
        },
      },
      patch: {
        summary: "Update contact by ID",
        tags: ["Contacts"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Contact updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Contact not found" },
        },
      },
      delete: {
        summary: "Soft delete contact by ID (sets deleted_at, cascades to addresses)",
        tags: ["Contacts"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          204: { description: "Contact soft deleted successfully" },
          401: { description: "Unauthorized" },
          404: { description: "Contact not found" },
        },
      },
    },
    "/api/contacts/{contactId}/addresses": {
      post: {
        summary: "Create address for contact",
        tags: ["Addresses"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "contactId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Address created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AddressResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Contact not found" },
        },
      },
      get: {
        summary: "List all addresses for contact (excludes soft-deleted)",
        tags: ["Addresses"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "contactId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Addresses retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AddressResponse/properties/data" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Contact not found" },
        },
      },
    },
    "/api/contacts/{contactId}/addresses/{addressId}": {
      get: {
        summary: "Get address by ID",
        tags: ["Addresses"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "contactId", in: "path", required: true, schema: { type: "integer" } },
          { name: "addressId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Address found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AddressResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Address not found or soft-deleted" },
        },
      },
      put: {
        summary: "Update address by ID",
        tags: ["Addresses"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "contactId", in: "path", required: true, schema: { type: "integer" } },
          { name: "addressId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Address updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AddressResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Address not found" },
        },
      },
      delete: {
        summary: "Soft delete address by ID (sets deleted_at)",
        tags: ["Addresses"],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "contactId", in: "path", required: true, schema: { type: "integer" } },
          { name: "addressId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          204: { description: "Address soft deleted successfully" },
          401: { description: "Unauthorized" },
          404: { description: "Address not found" },
        },
      },
    },
  },
};
