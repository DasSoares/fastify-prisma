import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import logger from "./logger";

import { userRoutes } from "./src/routes/User";
import { defaultRoutes } from "./src/routes/default";
import { schemaAPIResponseError } from "./src/schemas";
import { schemaUser, schemaUsers } from "./src/schemas/User";

const URL = "127.0.0.1";
const PORT = 3000;

// Your code here

// Cria os arquivos na pasta logs
const server = Fastify({
  logger: {
    level: "warn",
    transport: {
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
      targets: [
        {
          target: "pino/file",
          options: { destination: "./logs/warn.log" },
          level: "warn",
        },
        // {
        //   target: "pino/file",
        //   options: { destination: "./logs/error.log" },
        //   level: "error",
        // },
      ],
    },
  },
});

server.register(logger);

server.register(fastifyCors, {
  origin: ["*", `http://${URL}`],
});

server.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Exemplo Fastify API",
      description: "Uma api de teste com Fastify + Prisma",
      version: "1.0.0",
    },
    servers: [{ url: `http://${URL}:${PORT}`, description: "Servidor Local" }],
  },
  swagger: {
    host: "127.0.0.1:3000",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    // uiConfig: {
    //   docExpansion: 'none', // Controla o comportamento do Swagger UI
    //   deepLinking: false,
    // },
    // uiHooks: {
    //   onRequest: function (request: FastifyRequest, reply: FastifyReply) {},
    //   preHandler: function (request: FastifyRequest, reply: FastifyReply) {},
    // },
    // staticCSP: true,
    // exposeRoute: true,
  },
});

if (process.env.APP_ENV?.includes("development")) {
  // Show swagger UI when in development
  server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });
}

// Adição dos schemas
server.addSchema(schemaAPIResponseError);
server.addSchema(schemaUser);
server.addSchema(schemaUsers);

// registra as rotas
server.register(defaultRoutes, { prefix: "/" });
server.register(userRoutes, { prefix: "/user" });

server
  .listen({ host: URL, port: PORT })
  .then(() => {
    console.log("HTTP server running in the port:", PORT);
  })
  .catch((error) => {
    console.error(error);
  });
