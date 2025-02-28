import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import UserDB from "../controllers/UserDB";

// your code here
type UserPathParams = {
  id: string;
};

type UserQueryParams = {
  echo: string;
};

// type UserCreate = {
//   name: string;
//   email: string;
// };

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
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
              },            
            }
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { 
          limit: number, 
          page: number, 
        },
      }>,
      reply: FastifyReply
    ) => {
      let { limit, page } = request.query;
      
      if (!limit) limit = await prisma.user.count()
      if (!page) page = 0
      
      page = Number(page) * Number(limit)

      const users: User[] = await prisma.user.findMany({
        take: Number(limit),
        skip: Number(page),
      });
      
      if (!users) {
        reply.code(404).send({ message: "Usuários não encontrado" });
      }
      reply.send(users).status(200);
  });
  //#endregion

  server.get(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Get User By Id",
        description: "Obtém os dados do usuário",
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: UserPathParams;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const db = new UserDB();
      const user = await db.GetById(parseInt(id));

      if (!user) {
        reply.code(404).send({ message: "Usuário não encontrado" });
      }
      reply.send(user).status(200);
    }
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
          type: 'object',
          required: ["name", "email"],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            // teste: { type: 'string' } // opcional
          }
        },
        response: {
          201: {
            description: "Usuário criado com sucesso!", // I don`t think that`s it means about no content (204)
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: UserCreate }>,
      reply: FastifyReply
    ) => {
      const prisma = new PrismaClient();
      const body = request.body;

      try {
        const user = await prisma.user.create({
          data: {
            name: body.name,
            email: body.email,
          },
        });
      } catch (error: any) {
        console.log(error)
        reply.code(500).send({message: "Erro ao buscar ou inserir no banco de dados!"})
      }
      reply.send(null).status(201);
    }
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
          }
        },
        response: {
          204: {
            description: "Usuário modificado com sucesso"
          }
        }
      }
    },
    async (
      request: FastifyRequest<{
        Params: Pick<User, "id">;
        Body: UserUpdate;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { name, email } = request.body;

      try {
        const user = await prisma.user.update({
          where: { id: Number(id) },
          data: { name, email },
        });

        reply.code(200).send({ message: "Usuário alterado com sucesso!" });
      } catch (error: any) {
        let cause: string =
          error?.meta?.cause ||
          "Erro ao bucar ou alterar informação no banco de dados";
        reply.code(400).send({
          message: `Erro ao alterar o registro do usuário, erro: ${cause}`,
        });
      }
    }
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
            description: "Usuário deletado com sucesso"
          }
        }
      }
    },
    async (
      request: FastifyRequest<{
        Params: Pick<User, "id">;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      // delete retorna os dados do usuário que foi excluído
      try {
        const user = await prisma.user.delete({
          where: {
            id: Number(id),
          },
        });
        
        reply.code(204).send();
      } catch (error: any) {
        let cause: string = error?.meta?.cause || "Erro ao bucar ou alterar informação no banco de dados";
        reply.code(500).send({
          message: `Erro ao alterar o registro do usuário, erro: ${cause}`,
        });
      }
    }
  );
}
