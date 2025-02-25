"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = require("@fastify/cors");
const URL = "127.0.0.1";
const PORT = 8000;
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
const server = (0, fastify_1.default)({
    logger: (_a = envToLogger["test"]) !== null && _a !== void 0 ? _a : true,
}); //.withTypeProvider<JsonSchemaToTsProvider>();
server.register(cors_1.fastifyCors, { origin: "*" });
server.get("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    request.log.info("Sucesso");
    reply.send({ ping: "pong" });
}));
const opts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" },
                },
            },
        },
    },
};
server.get("/users/:id", opts, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const params = request.params;
    const seconds = 1;
    // setTimeout(() => {
    //   console.log("seu usuário");
    // }, seconds * 1000);
    // console.log(params.id);
    // response.send({ userId: id });
    response.send("Sucesso");
}));
server
    .listen({ port: PORT })
    .then(() => {
    console.log("HTTP server running in the port:", PORT);
})
    .catch((error) => {
    console.error(error);
});
