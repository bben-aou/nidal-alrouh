import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { DEFAULT_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { CommunityEventsService } from './community-events.service';
import { CommunitySanitizerService } from './community-sanitizer.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';

@Injectable()
export class CommunityCommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly events: CommunityEventsService,
    private readonly sanitizer: CommunitySanitizerService
  ) {}

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
    const sanitizedContent = sanitizeHtml(
      dto.content,
      DEFAULT_SANITIZE_OPTIONS
    );

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

    const sanitized = this.sanitizer.sanitizeComment({
      ...comment,
      isOwner: comment.userId === userId,
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
      this.sanitizer.sanitizeComment({
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
