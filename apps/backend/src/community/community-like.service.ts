import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CommunityEventsService } from './community-events.service';

@Injectable()
export class CommunityLikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: CommunityEventsService
  ) {}

  /**
   * Like a post. Idempotent: returns success even if already liked.
   * Emits a like event with current like count.
   * @param userId Liker user ID
   * @param postId Post ID to like
   */
  async likePost(userId: string, postId: string) {
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

      const likeCount = await this.prisma.postLike.count({ where: { postId } });
      this.events.emitPostLiked(postId, userId, likeCount);

      return { success: true, message: 'Post liked successfully' };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { success: true, message: 'Post already liked' };
      }
      throw error;
    }
  }

  /**
   * Unlike a post. No-op if not previously liked.
   * Emits an unlike event with current like count when a like is removed.
   * @param userId User ID
   * @param postId Post ID to unlike
   */
  async unlikePost(userId: string, postId: string) {
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

  /**
   * Check whether the user has liked the given post.
   * @param userId User ID
   * @param postId Post ID
   * @returns `{ hasLiked: boolean }`
   */
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
}
