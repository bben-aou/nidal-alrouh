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

    const sanitizedReason = sanitizeHtml(
      dto.reason,
      STRICT_TEXT_ONLY_SANITIZE_OPTIONS
    );

    const report = await this.prisma.postReport.create({
      data: { userId, postId, reason: sanitizedReason },
    });

    // Emit real-time event to the post room via domain event bus
    this.events.emitPostReported(postId, report);

    return { data: report, message: 'Report submitted' };
  }
}
