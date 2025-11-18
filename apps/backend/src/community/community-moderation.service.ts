import { Injectable, NotFoundException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

import { ContentModerationService } from '../common/services/content-moderation.service';
import { STRICT_TEXT_ONLY_SANITIZE_OPTIONS } from '../common/utils/sanitize-html.config';
import { PrismaService } from '../prisma/prisma.service';

import { CommunityEventsService } from './community-events.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class CommunityModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentModeration: ContentModerationService,
    private readonly events: CommunityEventsService
  ) {}

  /**
   * Hide a post for the given user.
   * Idempotent: returns success if already hidden. Emits a hide event.
   * @param userId User ID
   * @param postId Post ID
   */
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

    this.events.emitPostHidden(userId, postId);

    return { success: true, message: 'Post hidden' };
  }

  /**
   * Unhide a post for the given user.
   * No-op if not hidden. Emits an unhide event.
   * @param userId User ID
   * @param postId Post ID
   */
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

    this.events.emitPostUnhidden(userId, postId);

    return { success: true, message: 'Post unhidden' };
  }

  /**
   * Create a report for a post with sanitized reason.
   * Validates reason and emits a report event.
   * @param userId Reporter user ID
   * @param postId Post ID
   * @param dto Report payload
   */
  async createPostReport(userId: string, postId: string, dto: CreateReportDto) {
    this.contentModeration.validateReportReason(dto.reason);

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const sanitizedReason = sanitizeHtml(
      dto.reason,
      STRICT_TEXT_ONLY_SANITIZE_OPTIONS
    );

    const report = await this.prisma.postReport.create({
      data: { userId, postId, reason: sanitizedReason },
    });

    this.events.emitPostReported(postId, report);

    return { data: report, message: 'Report submitted' };
  }
}
