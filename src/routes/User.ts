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

const opts = {
  schema: {
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
};

const prisma = new PrismaClient();

export async function userRoutes(server: FastifyInstance) {
  //
  //#region Todos os usuarios
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const users: User[] = await prisma.user.findMany();
    if (!users) {
      return reply.code(404).send({ message: "Usuários não encontrado" });
    }
    reply.send(users).status(200);
  });
  //#endregion

  server.get(
    "/:id",
    opts,
    async (
      request: FastifyRequest<{
        Params: UserPathParams;
        // Querystring: UserQueryParams;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      // const { echo } = request.query;
      // console.log(echo);
      // console.log(request.query);

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
    async (
      request: FastifyRequest<{ Body: UserCreate }>,
      reply: FastifyReply
    ) => {
      const prisma = new PrismaClient();
      const body = request.body;

      await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
        },
      });
      reply.send().status(201);
    }
  );

  // Altera o registro - Update
  server.put(
    "/:id",
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
          error: `Erro ao alterar o registro do usuário, erro: ${cause}`,
        });
      }
    }
  );

  server.delete(
    "/:id",
    async (
      request: FastifyRequest<{
        Params: Pick<User, "id">;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      // delete retorna os dados do usuário que foi excluído
      const user = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      reply.code(204).send();
    }
  );
}
