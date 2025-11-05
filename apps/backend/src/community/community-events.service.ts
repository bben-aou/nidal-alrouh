import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface PostCreatedEvent {
  post: any;
}

export interface PostLikedEvent {
  postId: string;
  userId: string;
  likeCount: number;
}

export interface PostUnlikedEvent {
  postId: string;
  userId: string;
  likeCount: number;
}

export interface CommentCreatedEvent {
  postId: string;
  comment: any;
  authorUserId: string;
}

export interface PostUpdatedEvent {
  postId: string;
  post: any;
}

export interface PostDeletedEvent {
  postId: string;
}

export interface CommentDeletedEvent {
  postId: string;
  commentId: string;
}

export interface PostHiddenEvent {
  userId: string;
  postId: string;
}

export interface PostUnhiddenEvent {
  userId: string;
  postId: string;
}

export interface PostReportedEvent {
  postId: string;
  report: unknown;
}

@Injectable()
export class CommunityEventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitPostCreated(post: any) {
    this.eventEmitter.emit('post.created', { post } as PostCreatedEvent);
  }

  emitPostLiked(postId: string, userId: string, likeCount: number) {
    this.eventEmitter.emit('post.liked', {
      postId,
      userId,
      likeCount,
    } as PostLikedEvent);
  }

  emitPostUnliked(postId: string, userId: string, likeCount: number) {
    this.eventEmitter.emit('post.unliked', {
      postId,
      userId,
      likeCount,
    } as PostUnlikedEvent);
  }

  emitCommentCreated(postId: string, comment: any) {
    // Keep for backward compatibility if needed, but prefer the version with authorUserId
    this.eventEmitter.emit('comment.created', {
      postId,
      comment,
      authorUserId: comment?.userId,
    } as CommentCreatedEvent);
  }

  emitCommentCreatedByAuthor(
    postId: string,
    comment: any,
    authorUserId: string
  ) {
    this.eventEmitter.emit('comment.created', {
      postId,
      comment,
      authorUserId,
    } as CommentCreatedEvent);
  }

  emitPostUpdated(postId: string, post: any) {
    this.eventEmitter.emit('post.updated', {
      postId,
      post,
    } as PostUpdatedEvent);
  }

  emitPostDeleted(postId: string) {
    this.eventEmitter.emit('post.deleted', { postId } as PostDeletedEvent);
  }

  emitCommentDeleted(postId: string, commentId: string) {
    this.eventEmitter.emit('comment.deleted', {
      postId,
      commentId,
    } as CommentDeletedEvent);
  }

  emitPostHidden(userId: string, postId: string) {
    this.eventEmitter.emit('post.hidden', {
      userId,
      postId,
    } as PostHiddenEvent);
  }

  emitPostUnhidden(userId: string, postId: string) {
    this.eventEmitter.emit('post.unhidden', {
      userId,
      postId,
    } as PostUnhiddenEvent);
  }

  emitPostReported(postId: string, report: unknown) {
    this.eventEmitter.emit('post.reported', {
      postId,
      report,
    } as PostReportedEvent);
  }
}
