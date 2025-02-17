import __dirname from "../utils.js";

export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My API",
        version: "1.0.0",
        description: "Documentación de la API de My API",
      },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
  };