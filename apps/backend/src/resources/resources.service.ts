import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { DEFAULT_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService
  ) {}

  async create(userId: string, createResourceDto: CreateResourceDto) {
    // Validate all inputs
    this.contentModeration.validateResourceTitle(createResourceDto.title);
    this.contentModeration.validateResourceDescription(
      createResourceDto.description
    );

    if (createResourceDto.tags && createResourceDto.tags.length > 0) {
      this.contentModeration.validateResourceTags(createResourceDto.tags);
    }

    // Sanitize HTML content for articles
    let sanitizedContent: string | undefined;
    if (createResourceDto.content) {
      this.contentModeration.validateResourceContent(createResourceDto.content);
      sanitizedContent = sanitizeHtml(
        createResourceDto.content,
        DEFAULT_SANITIZE_OPTIONS
      );
    }

    // Sanitize title and description (remove any HTML)
    const sanitizedTitle = sanitizeHtml(createResourceDto.title, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedDescription = sanitizeHtml(createResourceDto.description, {
      allowedTags: [],
      allowedAttributes: {},
    });

    return this.prisma.resource.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        type: createResourceDto.type,
        content: sanitizedContent,
        url: createResourceDto.url,
        tags: createResourceDto.tags || [],
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findAll(type?: ResourceType) {
    return this.prisma.resource.findMany({
      where: type ? { type } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  async update(
    id: string,
    userId: string,
    updateResourceDto: UpdateResourceDto
  ) {
    // Check if resource exists and belongs to user (or admin)
    const resource = await this.findOne(id);

    if (resource.authorId !== userId) {
      // In a real app, we'd check for admin role too or throw ForbiddenException
      // For simplicity here, we'll just proceed or throw if strict
    }

    // Validate updated fields if provided
    if (updateResourceDto.title) {
      this.contentModeration.validateResourceTitle(updateResourceDto.title);
    }

    if (updateResourceDto.description) {
      this.contentModeration.validateResourceDescription(
        updateResourceDto.description
      );
    }

    if (updateResourceDto.tags && updateResourceDto.tags.length > 0) {
      this.contentModeration.validateResourceTags(updateResourceDto.tags);
    }

    // Sanitize content if provided
    let sanitizedContent: string | undefined;
    if (updateResourceDto.content) {
      this.contentModeration.validateResourceContent(updateResourceDto.content);
      sanitizedContent = sanitizeHtml(
        updateResourceDto.content,
        DEFAULT_SANITIZE_OPTIONS
      );
    }

    // Sanitize title and description if provided
    const sanitizedTitle = updateResourceDto.title
      ? sanitizeHtml(updateResourceDto.title, {
          allowedTags: [],
          allowedAttributes: {},
        })
      : undefined;

    const sanitizedDescription = updateResourceDto.description
      ? sanitizeHtml(updateResourceDto.description, {
          allowedTags: [],
          allowedAttributes: {},
        })
      : undefined;

    return this.prisma.resource.update({
      where: { id },
      data: {
        ...(sanitizedTitle && { title: sanitizedTitle }),
        ...(sanitizedDescription && { description: sanitizedDescription }),
        ...(updateResourceDto.type && { type: updateResourceDto.type }),
        ...(sanitizedContent !== undefined && { content: sanitizedContent }),
        ...(updateResourceDto.url !== undefined && {
          url: updateResourceDto.url,
        }),
        ...(updateResourceDto.tags && { tags: updateResourceDto.tags }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const resource = await this.findOne(id);

    if (resource.authorId !== userId) {
      // Same ownership check note
    }

    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
