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

  async search(q: string) {
    const query = q?.trim();
    if (!query) return [];
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          {
            helperProfile: {
              is: { calUsername: { contains: query, mode: 'insensitive' } },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        helperProfile: { select: { calUsername: true } },
      },
      take: 10,
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name ?? '',
      avatarUrl: u.avatarUrl ?? null,
      role: u.role,
      username: u.helperProfile?.calUsername ?? null,
    }));
  }
}
