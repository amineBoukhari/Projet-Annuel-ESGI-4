const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Management API",
      version: "1.0.0",
      description: "API for the restaurant back-office (invoices, expenses, inventory, suppliers).",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        CreateUserBody: {
          type: "object",
          required: ["email", "password", "username"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            username: { type: "string" },
            restaurantId: { type: "integer", description: "Defaults to the caller's own restaurantId if omitted" },
            mustChangePassword: { type: "boolean", default: true },
          },
        },
        SupplierBody: {
          type: "object",
          properties: {
            name: { type: "string" },
            companyName: { type: "string" },
            phone: { type: "string" },
            email: { type: "string", format: "email" },
            address: { type: "string" },
            notes: { type: "string" },
            status: { type: "string" },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.js"],
});

module.exports = swaggerSpec;
