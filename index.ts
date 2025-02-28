import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import logger from "./logger";

import { userRoutes } from "./src/routes/User";

const URL = "127.0.0.1";
const PORT = 3000;

// Your code here
const envToLogger = {
  development: {
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

const server = Fastify({
  // ignoreTrailingSlash: true,
  logger: {
    level: 'error',
    file: './logs/error.log',
  },
  // logger: envToLogger["development"] ?? true,
}); //.withTypeProvider<JsonSchemaToTsProvider>();

server.register(fastifyCors, {
  origin: ["*", `http://${URL}`],
});
server.register(logger);
server.register(
  fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Exemplo Fastify API',
        description: 'Uma api de teste com Fastify + Prisma',
        version: '1.0.0',
      },
      servers: [
        { url: `http://${URL}:${PORT}`, description: 'Servidor Local'},
      ]
    },
    // host: 'localhost:3000',
    // schemes: ['http'],
    // swagger: {
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
    // },
  },
);
server.register(fastifySwaggerUi);


async function sleep(sec: number) {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ message: "Dados retornado com sucesso!" });
    }, sec * 1000)
  );
}

// registra as rotas
server.register(userRoutes, { prefix: "/user" });
server.register(async () => {
  server.get(
    "/ping", 
    {
      schema: {
        tags: ["default"],
      }
    },
    async (request, reply) => {
      reply.send({ ping: "pong" });
    });
}, { prefix: "default" })
  
server
  .listen({ host: URL, port: PORT })
  .then(() => {
    console.log("HTTP server running in the port:", PORT);
  })
  .catch((error) => {
    console.error(error);
  });
