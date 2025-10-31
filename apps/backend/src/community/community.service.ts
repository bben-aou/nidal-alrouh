import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma, PostPrivacy } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import { GetPostsQueryDto } from './dto/get-posts.dto';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService
  ) {}

  // Sanitize post before returning or emitting: redact user for anonymous posts
  private sanitizePost<
    P extends {
      isAnonymous?: boolean;
      user?: unknown | null;
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

  // Sanitize comment before returning or emitting: redact user for anonymous comments
  private sanitizeComment<
    C extends {
      isAnonymous?: boolean;
      user?: unknown | null;
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

    // Emit real-time event
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostCreated(sanitized);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.created for post ${post.id}: ${errMsg}`,
        error?.stack
      );
    }

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
        ...(sanitizedContent !== undefined
          ? { content: sanitizedContent }
          : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
        ...(dto.isAnonymous !== undefined
          ? { isAnonymous: dto.isAnonymous }
          : {}),
        ...(dto.privacy !== undefined ? { privacy: dto.privacy } : {}),
        ...(dto.locale !== undefined ? { locale: dto.locale } : {}),
      },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    const sanitized = this.sanitizePost(updated);
    // Emit real-time event
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostUpdated(postId, sanitized);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.updated for post ${postId} by ${userId}: ${errMsg}`,
        error?.stack
      );
    }
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
    // Emit real-time event
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostDeleted(postId);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.deleted for post ${postId} by ${userId}: ${errMsg}`,
        error?.stack
      );
    }
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

      // Emit real-time event
      try {
        const { CommunityGateway } = await import('./community.gateway');
        const gateway = CommunityGateway.getInstance();
        if (gateway) {
          // Get updated like count
          const likeCount = await this.prisma.postLike.count({
            where: { postId },
          });
          gateway.emitPostLiked(postId, userId, likeCount);
        }
      } catch (error: any) {
        const errMsg = error?.message || 'Unknown error';
        this.logger.error(
          `Failed to emit post.liked for post ${postId} by ${userId}: ${errMsg}`,
          error?.stack
        );
      }

      return { success: true, message: 'Post liked successfully' };
    } catch (error) {
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

    // Emit real-time event if an unlike actually happened
    if (deletedLike.count > 0) {
      try {
        const likeCount = await this.prisma.postLike.count({
          where: { postId },
        });
        const { CommunityGateway } = await import('./community.gateway');
        const gateway = CommunityGateway.getInstance();
        if (gateway) {
          gateway.emitPostUnliked(postId, userId, likeCount);
        }
      } catch (error: any) {
        const errMsg = error?.message || 'Unknown error';
        this.logger.error(
          `Failed to emit post.unliked for post ${postId} by ${userId}: ${errMsg}`,
          error?.stack
        );
      }
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

    // Emit real-time event to the specific user
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostHidden(userId, postId);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.hidden for user ${userId} post ${postId}: ${errMsg}`,
        error?.stack
      );
    }

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

    // Emit real-time event to the specific user
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostUnhidden(userId, postId);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.unhidden for user ${userId} post ${postId}: ${errMsg}`,
        error?.stack
      );
    }

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

    // Emit real-time event to the post room
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitPostReported(postId, report);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit post.reported for post ${postId} by ${userId}: ${errMsg}`,
        error?.stack
      );
    }

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
          },
        },
      },
    });

    const sanitized = this.sanitizeComment({
      ...comment,
      isOwner: true, // User is always the owner of their own created comment
    });

    // Emit real-time event
    try {
      const { CommunityGateway } = await import('./community.gateway');
      const gateway = CommunityGateway.getInstance();
      if (gateway) {
        gateway.emitCommentCreated(postId, sanitized);
      }
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      this.logger.error(
        `Failed to emit comment.created for post ${postId} by ${userId}: ${errMsg}`,
        error?.stack
      );
    }

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
    return { success: true, message: 'Comment deleted' };
  }
}
