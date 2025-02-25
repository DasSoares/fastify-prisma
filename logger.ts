import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

async function requestLogger(fastify: FastifyInstance) {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { method, url, headers } = request;
      const date = new Date().toISOString();
      const host = headers.host;
      const userAgent = headers["user-agent"];
      console.log(`[${date}] ${host} ${method} ${url} - ${userAgent}`);
    }
  );
}

export default fp(requestLogger);
