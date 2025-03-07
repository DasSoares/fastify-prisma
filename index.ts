import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import logger from "./logger";

import { userRoutes } from "./src/routes/User";
import { defaultRoutes } from "./src/routes/default";

const URL = "127.0.0.1";
const PORT = 3000;

// Your code here
const envToLogger = {
  development: {
    level: "error",
    file: "./logs/error.log",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true, // true
  test: false,
};

// Cria os arquivos na pasta logs
const server = Fastify({
  logger: {
    level: "warn",
    transport: {
      targets: [
        {
          target: "pino/file",
          options: { destination: "./logs/warn.log" },
          level: "warn",
        },
        {
          target: "pino/file",
          options: { destination: "./logs/error.log" },
          level: "error",
        },
      ],
    },
  },
});

server.register(fastifyCors, {
  origin: ["*", `http://${URL}`],
});
server.register(logger);
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
    host: "localhost:3000",
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
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

async function sleep(sec: number) {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ message: "Dados retornado com sucesso!" });
    }, sec * 1000)
  );
}

// server.addSchema()

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
