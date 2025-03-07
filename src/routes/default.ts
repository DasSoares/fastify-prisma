import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export async function defaultRoutes(server: FastifyInstance) {
  server.get(
    "/ping",
    {
      schema: {
        tags: ["default"],
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "pong" });
    }
  );
}
