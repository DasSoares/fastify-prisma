import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { schemaUser, schemaUsers } from "../schemas/User";
import { UserController, StatusClient } from "../controllers/User";

// your code here
const schema = {
  $id: "User",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["id", "name", "email"],
};

type User = {
  id: number;
  name: string;
  email: string;
};
type UserCreate = Pick<User, "name" | "email">;
type UserUpdate = Pick<User, "name" | "email">;

const prisma = new PrismaClient();

export async function userRoutes(server: FastifyInstance) {
  //
  const userController = new UserController();
  //#region Todos os usuarios
  server.get(
    "/",
    {
      schema: {
        tags: ["user"],
        summary: "User list",
        description: "Lista de usuários",
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number" },
            page: { type: "number" },
            status: {
              type: 'string',
              enum: Object.keys(StatusClient), // Define o select com opções fixas
              description: 'Status do usuário',
            },
          },
        },
        response: {
          200: schemaUsers,
        },
      },
    },
    userController.AllOrPaginated.bind(userController),
  );
  //#endregion

  server.get(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Get User By Id",
        description: "Obtém os dados do usuário",
        response: {
          200: schemaUser,
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    userController.Get.bind(userController)
  );
  // ----- separator
  server.post(
    "/",
    {
      schema: {
        tags: ["user"],
        summary: "Create User",
        description: "Cria usuário",
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        response: {
          201: {
            description: "User created",
            type: "null",
          },
          500: {
            description: "Internal Server Error",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        },
      },
    },
    userController.createUser.bind(userController)
  );

  // Altera o registro - Update
  server.put(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Update User",
        description: "Edita o registro do usuário no banco de dados",
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        response: {
          204: {
            description: "No content",
            type: "null",
          },
        },
      },
    },
    userController.updateUser.bind(userController)
  );

  server.delete(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Delete User",
        description: "Deleta o registro do usuário no banco de dados",
        response: {
          204: {
            description: "No content",
            type: "null",
          },
        },
      },
    },
    userController.deleteUser.bind(userController)
  );
}
