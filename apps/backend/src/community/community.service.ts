import { Injectable, Logger } from '@nestjs/common';

import { CommunityCommentService } from './community-comment.service';
import { CommunityEventsService } from './community-events.service';
import { CommunityLikeService } from './community-like.service';
import { CommunityModerationService } from './community-moderation.service';
import { CommunityPostService } from './community-post.service';
import { CommunityStatsService } from './community-stats.service';
import { CommunityStatsResponseDto } from './dto/community-stats-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import { GetCommunityStatsDto } from './dto/get-community-stats.dto';
import { GetPostsQueryDto } from './dto/get-posts.dto';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(
    private readonly postService: CommunityPostService,
    private readonly commentService: CommunityCommentService,
    private readonly likeService: CommunityLikeService,
    private readonly moderationService: CommunityModerationService,
    private readonly statsService: CommunityStatsService,
    private readonly events: CommunityEventsService
  ) {}

  /**
   * Compute community statistics for the current period and compare to a previous period.
   * Returns totals and deltas for posts, likes, comments, and active members.
   * Note: `upcomingEvents` is a placeholder until an events module exists.
   * @param userId Current user ID (reserved for future role-based filtering).
   * @param query Stats period and optional custom date range.
   * @returns Aggregated stats and ISO period boundaries.
   */
  async getStats(
    userId: string,
    query: GetCommunityStatsDto
  ): Promise<CommunityStatsResponseDto> {
    return this.statsService.getStats(userId, query);
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  async getPosts(query: GetPostsQueryDto, currentUserId: string) {
    return this.postService.getPosts(query, currentUserId);
  }

  async getPostById(postId: string, currentUserId?: string) {
    return this.postService.getPostById(postId, currentUserId);
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: Partial<CreatePostDto>
  ) {
    return this.postService.updatePost(userId, postId, dto);
  }

  async deletePost(userId: string, postId: string) {
    return this.postService.deletePost(userId, postId);
  }

  async likePost(userId: string, postId: string) {
    return this.likeService.likePost(userId, postId);
  }

  async unlikePost(userId: string, postId: string) {
    return this.likeService.unlikePost(userId, postId);
  }

  async hasLiked(userId: string, postId: string) {
    return this.likeService.hasLiked(userId, postId);
  }

  async hidePost(userId: string, postId: string) {
    return this.moderationService.hidePost(userId, postId);
  }

  async unhidePost(userId: string, postId: string) {
    return this.moderationService.unhidePost(userId, postId);
  }

  async createPostReport(userId: string, postId: string, dto: CreateReportDto) {
    return this.moderationService.createPostReport(userId, postId, dto);
  }

  async createComment(userId: string, postId: string, dto: CreateCommentDto) {
    return this.commentService.createComment(userId, postId, dto);
  }

  async getComments(
    postId: string,
    query: GetCommentsQueryDto,
    currentUserId?: string
  ) {
    return this.commentService.getComments(postId, query, currentUserId);
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    return this.commentService.deleteComment(userId, postId, commentId);
  }
}
