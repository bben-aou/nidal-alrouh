import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflection, ReflectionMood, ReflectionPrivacy } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReflectionDto } from './dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async createReflection(
    userId: string,
    createReflectionDto: CreateReflectionDto
  ): Promise<Reflection> {
    try {
      const { title, content, mood, privacy } = createReflectionDto;

      // Validate mood enum
      if (mood && !Object.values(ReflectionMood).includes(mood)) {
        throw new BadRequestException('Invalid mood value');
      }

      // Validate privacy enum
      if (privacy && !Object.values(ReflectionPrivacy).includes(privacy)) {
        throw new BadRequestException('Invalid privacy value');
      }

      const reflection = await this.prisma.reflection.create({
        data: {
          title,
          content,
          mood,
          privacy: privacy as ReflectionPrivacy,
          tags: createReflectionDto.tags ?? [],
          userId,
        },
      });

      return reflection;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create reflection');
    }
  }

  async getReflectionsByUser(
    userId: string,
    searchQuery?: string
  ): Promise<any[]> {
    try {
      const whereClause: any = { userId };

      if (searchQuery?.trim()) {
        whereClause.OR = [
          {
            title: {
              contains: searchQuery.trim(),
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchQuery.trim(),
              mode: 'insensitive',
            },
          },
        ];
      }

      const reflections = await this.prisma.reflection.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reflections;
    } catch {
      throw new BadRequestException('Failed to retrieve reflections');
    }
  }

  async getReflectionById(id: string, userId: string): Promise<Reflection> {
    try {
      const reflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!reflection) {
        throw new NotFoundException('Reflection not found');
      }

      // Check if user owns the reflection or if it's public
      if (
        reflection.userId !== userId &&
        reflection.privacy !== ReflectionPrivacy.PUBLIC
      ) {
        throw new ForbiddenException('Access denied to this reflection');
      }

      return reflection;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve reflection');
    }
  }

  async updateReflection(
    id: string,
    userId: string,
    updateData: Partial<CreateReflectionDto>
  ): Promise<Reflection> {
    try {
      // First check if reflection exists and user owns it
      const existingReflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!existingReflection) {
        throw new NotFoundException('Reflection not found');
      }

      if (existingReflection.userId !== userId) {
        throw new ForbiddenException(
          'You can only update your own reflections'
        );
      }

      // Validate enums if provided
      if (
        updateData.mood &&
        !Object.values(ReflectionMood).includes(updateData.mood)
      ) {
        throw new BadRequestException('Invalid mood value');
      }

      if (
        updateData.privacy &&
        !Object.values(ReflectionPrivacy).includes(updateData.privacy)
      ) {
        throw new BadRequestException('Invalid privacy value');
      }

      const updatedReflection = await this.prisma.reflection.update({
        where: { id },
        data: {
          title: updateData.title,
          content: updateData.content,
          mood: updateData.mood as ReflectionMood,
          privacy: updateData.privacy as ReflectionPrivacy,
          tags: updateData.tags,
        },
      });

      return updatedReflection;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update reflection');
    }
  }

  async deleteReflection(id: string, userId: string): Promise<{ id: string }> {
    try {
      // First check if reflection exists and user owns it
      const existingReflection = await this.prisma.reflection.findUnique({
        where: { id },
      });

      if (!existingReflection) {
        throw new NotFoundException('Reflection not found');
      }

      if (existingReflection.userId !== userId) {
        throw new ForbiddenException(
          'You can only delete your own reflections'
        );
      }

      await this.prisma.reflection.delete({
        where: { id },
      });

      return { id };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete reflection');
    }
  }
}
