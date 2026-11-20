import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node RESTful API",
      version: "1.0.0",
      description: "RESTful API documentation with Express, Prisma, and MySQL",
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
            username: { type: "string", example: "baratrahjaga" },
            password: { type: "string", example: "password123" },
            name: { type: "string", example: "Jean R" },
          },
        },
        UserLoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "baratrahjaga" },
            password: { type: "string", example: "password123" },
          },
        },
        UserUpdateRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Jean Rantabaratrahjaga" },
            password: { type: "string", example: "newpassword123" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                username: { type: "string", example: "baratrahjaga" },
                name: { type: "string", example: "Jean R" },
              },
            },
            message: { type: "string", example: "success" },
          },
        },
        UserLoginResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "c7b5b882-9653-48ee-a0f5-585a953e54b6" },
              },
            },
            message: { type: "string", example: "login success" },
          },
        },
        UserLogoutResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                username: { type: "string", example: "baratrahjaga" },
              },
            },
            message: { type: "string", example: "Logout successful" },
          },
        },
        ContactCreateRequest: {
          type: "object",
          required: ["first_name"],
          properties: {
            first_name: { type: "string", example: "John" },
            last_name: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            phone: { type: "string", example: "081234567890" },
          },
        },
        ContactUpdateRequest: {
          type: "object",
          properties: {
            first_name: { type: "string", example: "Jane" },
            last_name: { type: "string", example: "Doe" },
            email: { type: "string", example: "jane.doe@example.com" },
            phone: { type: "string", example: "089876543210" },
          },
        },
        ContactResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                first_name: { type: "string", example: "John" },
                last_name: { type: "string", example: "Doe" },
                email: { type: "string", example: "john.doe@example.com" },
                phone: { type: "string", example: "081234567890" },
              },
            },
            message: { type: "string", example: "success" },
          },
        },
        ContactSearchResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  first_name: { type: "string", example: "John" },
                  last_name: { type: "string", example: "Doe" },
                  email: { type: "string", example: "john.doe@example.com" },
                  phone: { type: "string", example: "081234567890" },
                },
              },
            },
            paging: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                total_items: { type: "integer", example: 15 },
                total_page: { type: "integer", example: 2 },
              },
            },
          },
        },
        AddressCreateRequest: {
          type: "object",
          required: ["country", "postal_code"],
          properties: {
            street: { type: "string", example: "Jl. Danur Wenda No. 3" },
            city: { type: "string", example: "Malang" },
            province: { type: "string", example: "Jawa Timur" },
            country: { type: "string", example: "Indonesia" },
            postal_code: { type: "string", example: "65362" },
          },
        },
        AddressUpdateRequest: {
          type: "object",
          properties: {
            street: { type: "string", example: "Jl. Sudirman No. 10" },
            city: { type: "string", example: "Jakarta" },
            province: { type: "string", example: "DKI Jakarta" },
            country: { type: "string", example: "Indonesia" },
            postal_code: { type: "string", example: "12345" },
          },
        },
        AddressResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                street: { type: "string", example: "Jl. Danur Wenda No. 3" },
                city: { type: "string", example: "Malang" },
                province: { type: "string", example: "Jawa Timur" },
                country: { type: "string", example: "Indonesia" },
                postal_code: { type: "string", example: "65362" },
              },
            },
            message: { type: "string", example: "success" },
          },
        },
        AddressListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  street: { type: "string", example: "Jl. Danur Wenda No. 3" },
                  city: { type: "string", example: "Malang" },
                  province: { type: "string", example: "Jawa Timur" },
                  country: { type: "string", example: "Indonesia" },
                  postal_code: { type: "string", example: "65362" },
                },
              },
            },
            message: { type: "string", example: "Get data success" },
          },
        },
        ErrorResponse400: {
          type: "object",
          properties: {
            errors: { type: "string", example: "\"username\" is required" },
            message: { type: "string", example: "\"username\" is required" },
          },
        },
        ErrorResponse401: {
          type: "object",
          properties: {
            errors: { type: "string", example: "Unauthorized" },
            message: { type: "string", example: "Unauthorized" },
          },
        },
        ErrorResponse404: {
          type: "object",
          properties: {
            errors: { type: "string", example: "Contact not found" },
            message: { type: "string", example: "Contact not found" },
          },
        },
        ErrorResponse500: {
          type: "object",
          properties: {
            errors: { type: "string", example: "Internal Server Error" },
          },
        },
      },
    },
  },
  apis: ["./src/route/*.js", "./src/route/*.api.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
