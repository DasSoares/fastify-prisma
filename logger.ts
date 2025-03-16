import { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from "fastify";
import fp from "fastify-plugin";
import http  from 'http'


/**
 * 
 * @param userAgent Agente do cliente
 * @returns Retorna o agente requisitor comprimido
 */
function getBrowserInfo(userAgent: string | undefined) {
  if (!userAgent) return 'Desconhecido';

  if (/chrome|crios|crmo/i.test(userAgent)) return 'Google Chrome';
  if (/firefox|fxios/i.test(userAgent)) return 'Mozilla Firefox';
  if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Microsoft Edge';
  if (/opr|opera/i.test(userAgent)) return 'Opera';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';

  return userAgent;
}

// Tratamento da resposta da API
async function requestLogger(fastify: FastifyInstance) {
  fastify.addHook(
    "onResponse",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { method, url, headers } = request;
      const date = new Date().toISOString();
      const host = headers.host;
      const userAgent = headers["user-agent"];
      console.log(`[${date}] ${host} - "${method} ${url}" ${reply.statusCode} ${http.STATUS_CODES[reply.statusCode]} - ${getBrowserInfo(userAgent)}`);
    }
  );

  // Retorna o erro quando quando é relançado
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error(error);
    const statusCode = getStatusCodeTypeExcepiontError(error); 
  
    if (error.validation) {
      return reply.status(400).send({ message: error.validation[0]?.message });
    }
    return reply.status(statusCode).send({ message: error.message });
  });
}

// adicionar novos status
function getStatusCodeTypeExcepiontError(error: FastifyError) {
  if (error?.name === "PrismaClientInitializationError") return 400.
  return 500
}


export default fp(requestLogger);
