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
