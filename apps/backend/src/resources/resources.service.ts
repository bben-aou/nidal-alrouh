import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceType } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { DEFAULT_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { ResourceEvent } from './constants/events.constants';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceInteractionsService } from './resource-interactions.service';

interface FindAllOptions {
  type?: ResourceType;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
}

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly interactions?: ResourceInteractionsService
  ) {}

  async create(userId: string, createResourceDto: CreateResourceDto) {
    this.contentModeration.validateResourceTitle(createResourceDto.title);
    this.contentModeration.validateResourceDescription(
      createResourceDto.description
    );

    if (createResourceDto.tags && createResourceDto.tags.length > 0) {
      this.contentModeration.validateResourceTags(createResourceDto.tags);
    }

    let sanitizedContent: string | undefined;
    if (createResourceDto.content) {
      this.contentModeration.validateResourceContent(createResourceDto.content);
      sanitizedContent = sanitizeHtml(
        createResourceDto.content,
        DEFAULT_SANITIZE_OPTIONS
      );
    }

    const sanitizedTitle = sanitizeHtml(createResourceDto.title, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedDescription = sanitizeHtml(createResourceDto.description, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const resource = await this.prisma.resource.create({
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

    this.eventEmitter.emit(ResourceEvent.ResourceCreated, { resource });

    return resource;
  }

  /**
   * Find all resources with optional filtering and pagination
   */
  async findAll(options: FindAllOptions = {}) {
    const { type, tags, search, page = 1, limit = 20, userId } = options;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        skip,
        take: limit,
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
      }),
      this.prisma.resource.count({ where }),
    ]);

    if (userId && this.interactions) {
      const enrichedResources = await Promise.all(
        resources.map(async (resource) => ({
          ...resource,
          isBookmarked: await this.interactions!.isBookmarked(
            userId,
            resource.id
          ),
          isCompleted: await this.interactions!.isCompleted(
            userId,
            resource.id
          ),
        }))
      );

      return {
        data: enrichedResources,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return {
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single resource by ID, optionally with user-specific data
   */
  async findOne(id: string, userId?: string) {
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

    if (userId && this.interactions) {
      const [isBookmarked, isCompleted, bookmark] = await Promise.all([
        this.interactions.isBookmarked(userId, id),
        this.interactions.isCompleted(userId, id),
        this.prisma.resourceBookmark.findUnique({
          where: {
            userId_resourceId: {
              userId,
              resourceId: id,
            },
          },
        }),
      ]);

      return {
        ...resource,
        isBookmarked,
        isCompleted,
        bookmarkProgress: bookmark?.progress,
      };
    }

    return resource;
  }

  async update(
    id: string,
    userId: string,
    updateResourceDto: UpdateResourceDto
  ) {
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

    let sanitizedContent: string | undefined;
    if (updateResourceDto.content) {
      this.contentModeration.validateResourceContent(updateResourceDto.content);
      sanitizedContent = sanitizeHtml(
        updateResourceDto.content,
        DEFAULT_SANITIZE_OPTIONS
      );
    }

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

    const updatedResource = await this.prisma.resource.update({
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

    this.eventEmitter.emit(ResourceEvent.ResourceUpdated, {
      resourceId: id,
      resource: updatedResource,
    });

    return updatedResource;
  }

  async remove(id: string) {
    const resource = await this.prisma.resource.delete({
      where: { id },
    });

    this.eventEmitter.emit(ResourceEvent.ResourceDeleted, {
      resourceId: id,
    });

    return resource;
  }
}
