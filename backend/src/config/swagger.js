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
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.js"],
});

module.exports = swaggerSpec;
