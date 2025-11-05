import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma, PostPrivacy, User } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { PrismaService } from '../prisma/prisma.service';

import { CommunityEventsService } from './community-events.service';
import { CommunityStatsResponseDto } from './dto/community-stats-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import {
  GetCommunityStatsDto,
  StatsPeriod,
} from './dto/get-community-stats.dto';
import { GetPostsQueryDto } from './dto/get-posts.dto';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly events: CommunityEventsService
  ) {}

  // Sanitize post before returning or emitting: redact user for anonymous posts
  private sanitizePost<
    P extends {
      isAnonymous?: boolean;
      user?: Pick<User, 'id' | 'name'> | null;
      isOwner?: boolean;
    } & Record<string, unknown>,
  >(post: P): P {
    if (!post || !post.isAnonymous) return post;
    const copy = { ...post, user: null } as P;
    if ('userId' in copy) {
      delete (copy as Record<string, unknown>).userId;
    }
    return copy;
  }

  private calculateDateRanges(
    period: StatsPeriod,
    startDate?: string,
    endDate?: string
  ) {
    const now = new Date();
    let currentStart: Date;
    let currentEnd: Date;

    if (period === StatsPeriod.CUSTOM && startDate && endDate) {
      currentStart = new Date(startDate);
      currentEnd = new Date(endDate);
    } else {
      currentEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      switch (period) {
        case StatsPeriod.MONTH: {
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 29);
          break;
        }
        case StatsPeriod.ALL: {
          currentStart = new Date(2020, 0, 1);
          break;
        }
        case StatsPeriod.WEEK:
        default: {
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 6);
          break;
        }
      }

      currentStart.setHours(0, 0, 0, 0);
    }

    const periodDuration = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - periodDuration);

    return {
      currentPeriod: { start: currentStart, end: currentEnd },
      previousPeriod: { start: previousStart, end: previousEnd },
    };
  }

  private async getCountsForPeriod(period: { start: Date; end: Date }) {
    const [posts, likes, comments] = await Promise.all([
      this.prisma.post.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
      this.prisma.postLike.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
      this.prisma.comment.count({
        where: { createdAt: { gte: period.start, lte: period.end } },
      }),
    ]);
    return { posts, likes, comments };
  }

  private async getActiveUserIdsForPeriod(period: { start: Date; end: Date }) {
    const [postUsers, likeUsers, commentUsers] = await Promise.all([
      this.prisma.post.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
      this.prisma.postLike.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
      this.prisma.comment.findMany({
        where: { createdAt: { gte: period.start, lte: period.end } },
        select: { userId: true },
      }),
    ]);

    const userIds = new Set<string>();
    for (const p of postUsers) {
      userIds.add(p.userId);
    }
    for (const l of likeUsers) {
      userIds.add(l.userId);
    }
    for (const c of commentUsers) {
      userIds.add(c.userId);
    }
    return userIds;
  }

  async getStats(
    userId: string,
    query: GetCommunityStatsDto
  ): Promise<CommunityStatsResponseDto> {
    const { period = StatsPeriod.WEEK, startDate, endDate } = query;

    const { currentPeriod, previousPeriod } = this.calculateDateRanges(
      period,
      startDate,
      endDate
    );

    // Current period counts
    const [
      { posts: currentPosts, likes: currentLikes, comments: currentComments },
      currentActiveUsersSet,
    ] = await Promise.all([
      this.getCountsForPeriod(currentPeriod),
      this.getActiveUserIdsForPeriod(currentPeriod),
    ]);

    // Previous period counts
    const [
      { posts: prevPosts, likes: prevLikes, comments: prevComments },
      prevActiveUsersSet,
    ] = await Promise.all([
      this.getCountsForPeriod(previousPeriod),
      this.getActiveUserIdsForPeriod(previousPeriod),
    ]);

    const activeMembers = currentActiveUsersSet.size;
    const prevActiveMembers = prevActiveUsersSet.size;

    const upcomingEvents = 0; // Placeholder until events module exists
    const prevUpcomingEvents = 0;

    return {
      totalPosts: currentPosts,
      totalPostsChange: currentPosts - prevPosts,
      totalLikes: currentLikes,
      totalLikesChange: currentLikes - prevLikes,
      totalComments: currentComments,
      totalCommentsChange: currentComments - prevComments,
      activeMembers,
      activeMembersChange: activeMembers - prevActiveMembers,
      upcomingEvents,
      upcomingEventsChange: upcomingEvents - prevUpcomingEvents,
      period: {
        start: currentPeriod.start.toISOString(),
        end: currentPeriod.end.toISOString(),
      },
    };
  }

  // Sanitize comment before returning or emitting: redact user for anonymous comments
  private sanitizeComment<
    C extends {
      isAnonymous?: boolean;
      user?: Pick<User, 'id' | 'name' | 'email'> | null;
      isOwner?: boolean;
    } & Record<string, unknown>,
  >(comment: C): C {
    if (!comment || !comment.isAnonymous) return comment;
    const copy = { ...comment, user: null } as C;
    if ('userId' in copy) {
      delete (copy as Record<string, unknown>).userId;
    }
    return copy;
  }

  async createPost(userId: string, dto: CreatePostDto) {
    // Content moderation validation
    this.contentModeration.validatePostContent(dto.content);

    const sanitizedContent = sanitizeHtml(dto.content, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    });

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

    const sanitized = this.sanitizePost({
      ...post,
      isOwner: true, // User is always the owner of their own created post
      likedByMe: false,
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
      return this.sanitizePost({
        ...p,
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
      data: this.sanitizePost({
        ...post,
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

    const sanitizedContent = dto.content
      ? sanitizeHtml(dto.content, {
          allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
          allowedAttributes: {},
          disallowedTagsMode: 'discard',
        })
      : undefined;

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(sanitizedContent ? { content: sanitizedContent } : {}),
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
    const sanitized = this.sanitizePost(updated);
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

  async likePost(userId: string, postId: string) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    try {
      await this.prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });

      // Emit real-time event via domain event bus
      const likeCount = await this.prisma.postLike.count({ where: { postId } });
      this.events.emitPostLiked(postId, userId, likeCount);

      return { success: true, message: 'Post liked successfully' };
    } catch (error: unknown) {
      // Handle duplicate like (Prisma P2002 error for unique constraint violation)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { success: true, message: 'Post already liked' };
      }
      throw error;
    }
  }

  async unlikePost(userId: string, postId: string) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const deletedLike = await this.prisma.postLike.deleteMany({
      where: {
        userId,
        postId,
      },
    });

    // Emit real-time event if an unlike actually happened via domain event bus
    if (deletedLike.count > 0) {
      const likeCount = await this.prisma.postLike.count({ where: { postId } });
      this.events.emitPostUnliked(postId, userId, likeCount);
    }

    return {
      success: true,
      message:
        deletedLike.count > 0
          ? 'Post unliked successfully'
          : 'Post was not liked',
    };
  }

  async hidePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.hiddenPost.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      return { success: true, message: 'Post already hidden' };
    }
    await this.prisma.hiddenPost.create({ data: { postId, userId } });

    // Emit real-time event to the specific user via domain event bus
    this.events.emitPostHidden(userId, postId);

    return { success: true, message: 'Post hidden' };
  }

  async unhidePost(userId: string, postId: string) {
    const existing = await this.prisma.hiddenPost.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (!existing) {
      return { success: true, message: 'Post not hidden' };
    }
    await this.prisma.hiddenPost.delete({
      where: { postId_userId: { postId, userId } },
    });

    // Emit real-time event to the specific user via domain event bus
    this.events.emitPostUnhidden(userId, postId);

    return { success: true, message: 'Post unhidden' };
  }

  async createPostReport(userId: string, postId: string, dto: CreateReportDto) {
    // Content moderation validation for report reason
    this.contentModeration.validateReportReason(dto.reason);

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const sanitizedReason = sanitizeHtml(dto.reason, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    });

    const report = await this.prisma.postReport.create({
      data: { userId, postId, reason: sanitizedReason },
    });

    // Emit real-time event to the post room via domain event bus
    this.events.emitPostReported(postId, report);

    return { data: report, message: 'Report submitted' };
  }

  async hasLiked(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const like = await this.prisma.postLike.findFirst({
      where: { userId, postId },
    });
    return { hasLiked: !!like };
  }

  async createComment(userId: string, postId: string, dto: CreateCommentDto) {
    // Content moderation validation
    this.contentModeration.validateCommentContent(dto.content);

    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Sanitize content to prevent XSS attacks
    const sanitizedContent = sanitizeHtml(dto.content, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    });

    const comment = await this.prisma.comment.create({
      data: {
        content: sanitizedContent,
        isAnonymous: dto.isAnonymous || false,
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.debug(
      `comment.userId === userId: ${comment.userId === userId}`
    );
    const sanitized = this.sanitizeComment({
      ...comment,
      isOwner: comment.userId === userId,
      // isOwner: true,
    });

    // Emit real-time event via domain event bus
    this.events.emitCommentCreatedByAuthor(postId, sanitized, userId);

    return sanitized;
  }

  async getComments(
    postId: string,
    query: GetCommentsQueryDto,
    currentUserId?: string
  ) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const take = query.limit ?? 20;
    const cursorId = query.cursor;

    const where: Prisma.CommentWhereInput = {
      postId,
    };

    const comments = await this.prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const sanitizedItems = comments.map((c) =>
      this.sanitizeComment({
        ...c,
        isOwner: currentUserId ? c.userId === currentUserId : false,
      })
    );
    const nextCursor =
      comments.length === take ? comments[comments.length - 1]?.id : undefined;
    return { items: sanitizedItems, nextCursor };
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (comment?.postId !== postId) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });

    // Emit real-time event via domain event bus
    this.events.emitCommentDeleted(postId, commentId);

    return { success: true, message: 'Comment deleted' };
  }
}
