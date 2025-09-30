// src/swagger.ts
import { Express } from "express";
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger options
const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WildBerries API",
      version: "1.0.0",
      description: "API documentation for WildBerries e-commerce backend",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
