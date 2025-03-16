import { FastifyRequest, FastifyReply } from "fastify";
import { UserService, User as IUser } from "../services/User";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async AllOrPaginated(
    request: FastifyRequest<{
      Querystring: {
        limit: number;
        page: number;
      };
    }>,
    reply: FastifyReply
  ) {
    const users: IUser[] = await this.userService.getAllUsers(request.query);
    reply.send(users).status(200);
  }

  async Get(
    request: FastifyRequest<{
      Params: Pick<IUser, "id">;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const user = await this.userService.getUser(id);

      if (!user) {
        request.log.error("Usuário não encontrado");
        return reply.code(404).send({ message: "Usuário não encontrado" });
      }

      return reply.code(200).send(user);
    } catch (error: any) {
      error.message = "Erro ao buscar ou inserir no banco de dados.";
      throw error;
    }
  }

  async createUser(
    request: FastifyRequest<{ Body: Omit<IUser, "id"> }>,
    reply: FastifyReply
  ){
    try {
      await this.userService.createUser(request.body)
      return reply.code(201).send();
    } catch (error: any) {
      error.message = error?.meta?.cause || "Erro ao inserir os dados do usuário no banco";
      throw error
    }
  }

  async updateUser(
    request: FastifyRequest<{
      Params: Pick<IUser, "id">;
      Body: Omit<IUser, "id">;
    }>,
    reply: FastifyReply
  ) {
    try {
      await this.userService.updateUser({...request.params,...request.body})
      return reply.code(200).send({message: "Usuário alterado com sucesso!"})
    } catch (error: any) {
      error.message = error?.meta?.cause || "";
      throw error
    }
  }

  async deleteUser(
    request: FastifyRequest<{
      Params: Pick<IUser, "id">;
    }>,
    reply: FastifyReply
  ) {
    try {
      await this.userService.deleteUser(request.params.id);
      return reply.code(204).send();
    } catch (error: any) {
      error.message =
        error?.meta?.cause || "Erro ao buscar ou alterar os dados do usuario!";
      throw error;
    }
  }
}
