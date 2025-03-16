import { PrismaClient } from "@prisma/client";


export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  private prisma: PrismaClient;
  public user = null
  
  constructor(){
    this.prisma = new PrismaClient();
  }

  async getUser(pk: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: Number(pk),
      }
    });
  }

  async getAllUsers({ limit, page} : { limit?: number, page?: number}): Promise<User[]> {
    if (!limit) limit = await this.prisma.user.count();
    if (!page) page = 0;
    page = Number(page) * Number(limit);

    return await this.prisma.user.findMany({
      take: Number(limit),
      skip: Number(page)
    });
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    // em caso de erro, recorrer aos logs
    const result = await this.prisma.user.create({
      data: {
        ...user
      },
    });
    return result;
  }

  async updateUser(user: User): Promise<User> {
    const record_update: any = {}
    if (user.name) record_update['name'] = user.name;
    if (user.email) record_update['email'] = user.email
    return await this.prisma.user.update({
      where: {
        id: Number(user.id)
      },
      data: record_update
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
