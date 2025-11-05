import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, PostPrivacy } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { DEFAULT_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { CommunityEventsService } from './community-events.service';
import { CommunitySanitizerService } from './community-sanitizer.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts.dto';

@Injectable()
export class CommunityPostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly events: CommunityEventsService,
    private readonly sanitizer: CommunitySanitizerService
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    // Content moderation validation
    this.contentModeration.validatePostContent(dto.content);

    const sanitizedContent = sanitizeHtml(
      dto.content,
      DEFAULT_SANITIZE_OPTIONS
    );

    const data: Prisma.PostCreateInput = {
      content: sanitizedContent,
      tags: dto.tags ?? [],
      isAnonymous: dto.isAnonymous ?? false,
      privacy: dto.privacy ?? PostPrivacy.PUBLIC,
      locale: dto.locale,
      user: { connect: { id: userId } },
    };

    const post = await this.prisma.post.create({
      data,
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const sanitized = this.sanitizer.sanitizePost({
      id: post.id,
      content: post.content,
      tags: post.tags,
      isAnonymous: post.isAnonymous,
      privacy: post.privacy,
      locale: post.locale,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isOwner: true, // User is always the owner of their own created post
      likedByMe: false,
      likesCount: post._count?.likes ?? 0,
      commentsCount: post._count?.comments ?? 0,
    });

    // Emit real-time event via domain event bus
    this.events.emitPostCreated(sanitized);

    return sanitized;
  }

  async getPosts(query: GetPostsQueryDto, currentUserId: string) {
    const take = query.limit ?? 20;
    const cursorId = query.cursor;

    const where: Prisma.PostWhereInput = {
      privacy: PostPrivacy.PUBLIC,
      ...(query.locale ? { locale: query.locale } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
    };

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const likedPosts = await this.prisma.postLike.findMany({
      where: {
        userId: currentUserId,
        postId: { in: posts.map((p) => p.id) },
      },
      select: { postId: true },
    });
    const likedSet = new Set(likedPosts.map((l) => l.postId));

    const sanitizedItems = posts.map((p) => {
      const isOwner = p.userId === currentUserId;
      const likedByMe = likedSet.has(p.id);
      const likesCount = p._count?.likes ?? 0;
      const commentsCount = p._count?.comments ?? 0;
      return this.sanitizer.sanitizePost({
        id: p.id,
        content: p.content,
        tags: p.tags,
        isAnonymous: p.isAnonymous,
        privacy: p.privacy,
        locale: p.locale,
        userId: p.userId,
        user: p.user,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        isOwner,
        likedByMe,
        likesCount,
        commentsCount,
      });
    });
    const nextCursor =
      posts.length === take ? posts[posts.length - 1]?.id : undefined;
    return { items: sanitizedItems, nextCursor };
  }

  async getPostById(postId: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likedByMe = currentUserId
      ? !!(await this.prisma.postLike.findFirst({
          where: { userId: currentUserId, postId },
          select: { id: true },
        }))
      : false;
    const likesCount = post._count?.likes ?? 0;
    const commentsCount = post._count?.comments ?? 0;

    return {
      data: this.sanitizer.sanitizePost({
        id: post.id,
        content: post.content,
        tags: post.tags,
        isAnonymous: post.isAnonymous,
        privacy: post.privacy,
        locale: post.locale,
        userId: post.userId,
        user: post.user,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        isOwner: currentUserId ? post.userId === currentUserId : false,
        likedByMe,
        likesCount,
        commentsCount,
      }),
    };
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: Partial<CreatePostDto>
  ) {
    const existing = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!existing) {
      throw new NotFoundException('Post not found');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('You cannot modify this post');
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(dto.content
          ? {
              content: sanitizeHtml(
                dto.content ?? '',
                DEFAULT_SANITIZE_OPTIONS
              ),
            }
          : {}),
        ...(dto.tags ? { tags: dto.tags } : {}),
        ...(dto.isAnonymous ? { isAnonymous: dto.isAnonymous } : {}),
        ...(dto.privacy ? { privacy: dto.privacy } : {}),
        ...(dto.locale ? { locale: dto.locale } : {}),
      },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    const sanitized = this.sanitizer.sanitizePost({
      id: updated.id,
      content: updated.content,
      tags: updated.tags,
      isAnonymous: updated.isAnonymous,
      privacy: updated.privacy,
      locale: updated.locale,
      userId: updated.userId,
      user: updated.user,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      isOwner: true,
      likedByMe: false,
      likesCount: updated._count?.likes ?? 0,
      commentsCount: updated._count?.comments ?? 0,
    });
    // Emit real-time event via domain event bus
    this.events.emitPostUpdated(postId, sanitized);
    return { data: sanitized, message: 'Post updated' };
  }

  async deletePost(userId: string, postId: string) {
    const existing = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!existing) {
      throw new NotFoundException('Post not found');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await this.prisma.post.delete({ where: { id: postId } });
    // Emit real-time event via domain event bus
    this.events.emitPostDeleted(postId);
    return { success: true, message: 'Post deleted' };
  }
}
