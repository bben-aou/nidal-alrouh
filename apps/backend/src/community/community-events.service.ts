import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CommunityEvent } from './constants/events.constants';
import {
  SanitizedPost,
  SanitizedComment,
  PostCreatedEvent,
  PostLikedEvent,
  PostUnlikedEvent,
  CommentCreatedEvent,
  PostUpdatedEvent,
  PostDeletedEvent,
  CommentDeletedEvent,
  PostHiddenEvent,
  PostUnhiddenEvent,
  PostReportedEvent,
} from './types';

@Injectable()
export class CommunityEventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitPostCreated(post: SanitizedPost) {
    this.eventEmitter.emit(CommunityEvent.PostCreated, {
      post,
    } as PostCreatedEvent);
  }

  emitPostLiked(postId: string, userId: string, likeCount: number) {
    this.eventEmitter.emit(CommunityEvent.PostLiked, {
      postId,
      userId,
      likeCount,
    } as PostLikedEvent);
  }

  emitPostUnliked(postId: string, userId: string, likeCount: number) {
    this.eventEmitter.emit(CommunityEvent.PostUnliked, {
      postId,
      userId,
      likeCount,
    } as PostUnlikedEvent);
  }

  emitCommentCreated(postId: string, comment: SanitizedComment) {
    // Keep for backward compatibility if needed, but prefer the version with authorUserId
    this.eventEmitter.emit(CommunityEvent.CommentCreated, {
      postId,
      comment,
      authorUserId: comment?.userId,
    } as CommentCreatedEvent);
  }

  emitCommentCreatedByAuthor(
    postId: string,
    comment: SanitizedComment,
    authorUserId: string
  ) {
    this.eventEmitter.emit(CommunityEvent.CommentCreated, {
      postId,
      comment,
      authorUserId,
    } as CommentCreatedEvent);
  }

  emitPostUpdated(postId: string, post: SanitizedPost) {
    this.eventEmitter.emit(CommunityEvent.PostUpdated, {
      postId,
      post,
    } as PostUpdatedEvent);
  }

  emitPostDeleted(postId: string) {
    this.eventEmitter.emit(CommunityEvent.PostDeleted, {
      postId,
    } as PostDeletedEvent);
  }

  emitCommentDeleted(postId: string, commentId: string) {
    this.eventEmitter.emit(CommunityEvent.CommentDeleted, {
      postId,
      commentId,
    } as CommentDeletedEvent);
  }

  emitPostHidden(userId: string, postId: string) {
    this.eventEmitter.emit(CommunityEvent.PostHidden, {
      userId,
      postId,
    } as PostHiddenEvent);
  }

  emitPostUnhidden(userId: string, postId: string) {
    this.eventEmitter.emit(CommunityEvent.PostUnhidden, {
      userId,
      postId,
    } as PostUnhiddenEvent);
  }

  emitPostReported(postId: string, report: unknown) {
    this.eventEmitter.emit(CommunityEvent.PostReported, {
      postId,
      report,
    } as PostReportedEvent);
  }
}
export { SanitizedPost, SanitizedComment };
