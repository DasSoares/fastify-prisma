import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UserDB {
  constructor() {}

  async GetById(userId: number) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  }
}
