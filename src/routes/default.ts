import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { schemaSuccess } from '../schemas'


export async function defaultRoutes(server: FastifyInstance) {
  server.get(
    "/ping",
    {
      schema: {
        tags: ["default"],
        response: {
          200: schemaSuccess,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "pong" });
    }
  );
}
