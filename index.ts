import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import logger from "./logger";

// Prisma
import UserDB from "./src/controllers/UserDB";
import { PrismaClient } from "@prisma/client";
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
  logger: true,
  // logger: envToLogger["development"] ?? true,
}); //.withTypeProvider<JsonSchemaToTsProvider>();

server.register(fastifyCors, {
  origin: ["*", "http://127.0.0.1"],
});
server.register(logger);
server.register(
  fastifySwagger
  // não está funcionando
  //   {
  //   routePrefix: '/documentation',
  //   swagger: {
  //     info: {
  //       title: 'Fastify API',
  //       description: 'API documentation',
  //       version: '1.0.0'
  //     },
  //     host: 'localhost:3000',
  //     schemes: ['http'],
  //     consumes: ['application/json'],
  //     produces: ['application/json']
  //   },
  //   exposeRoute: true
  // }
);
server.register(fastifySwaggerUi);

// registra as rotas
server.register(userRoutes, { prefix: "/user" });

async function sleep(sec: number) {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ message: "Dados retornado com sucesso!" });
    }, sec * 1000)
  );
}

server.get("/ping2", async (request, reply) => {
  await sleep(10);
  reply.send({ ping: "pong" });
});

server.get("/ping", (request, reply) => {
  setTimeout(() => {
    reply.send({ ping: "pong" });
  }, 10000);
});

server
  .listen({ port: PORT })
  .then(() => {
    console.log("HTTP server running in the port:", PORT);
  })
  .catch((error) => {
    console.error(error);
  });
