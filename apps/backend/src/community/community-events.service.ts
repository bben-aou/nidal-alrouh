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
}

export interface PostUpdatedEvent {
  postId: string;
  post: any;
}

export interface PostDeletedEvent {
  postId: string;
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
    this.eventEmitter.emit('comment.created', {
      postId,
      comment,
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
}
