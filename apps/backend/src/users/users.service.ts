import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
