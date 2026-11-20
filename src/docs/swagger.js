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

export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .info .title {
      border-bottom: 4px solid #facc15;
      display: inline-block;
      padding-bottom: 4px;
    }
    .swagger-ui .topbar {
      background-color: #1b1b1b;
    }
    .swagger-ui .topbar-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .swagger-ui-logout-btn {
      background-color: #ef4444;
      color: #ffffff !important;
      text-decoration: none !important;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      margin-left: auto;
      margin-right: 16px;
      display: inline-block;
      line-height: 20px;
      cursor: pointer;
      z-index: 999;
      transition: background-color 0.2s;
    }
    .swagger-ui-logout-btn:hover {
      background-color: #dc2626;
    }
  `,
  customJsStr: `
    (function() {
      function initSwaggerAuth() {
        const match = document.cookie.match(/api_token=([^;]+)/);
        const token = match ? decodeURIComponent(match[1]) : null;
        if (token && window.ui && typeof window.ui.preauthorizeApiKey === 'function') {
          window.ui.preauthorizeApiKey('ApiKeyAuth', token);
          return true;
        }
        return false;
      }

      function mountLogout() {
        const topbar = document.querySelector('.topbar-wrapper') || document.querySelector('.topbar');
        if (topbar && !document.getElementById('docs-logout-btn')) {
          const link = document.createElement('a');
          link.id = 'docs-logout-btn';
          link.href = '/api-docs/logout';
          link.className = 'swagger-ui-logout-btn';
          link.textContent = 'Logout';
          topbar.appendChild(link);
          return true;
        }
        return false;
      }

      let count = 0;
      const timer = setInterval(() => {
        count++;
        initSwaggerAuth();
        mountLogout();
        if (count > 40) {
          clearInterval(timer);
        }
      }, 150);
    })();
  `,
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
  },
  customSiteTitle: "Node RESTful API Documentation",
};
