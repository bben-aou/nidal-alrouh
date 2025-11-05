import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class CommunitySanitizerService {
  /**
   * Sanitize a post-like object by redacting user information when anonymous.
   * - If `isAnonymous` is true, sets `user` to `null` and removes `userId`.
   * - Returns a shallow copy preserving the generic type `P`.
   * @param post Post-like object that may include `isAnonymous`, `user`, and `userId`.
   * @returns Sanitized post-like object with user info removed when anonymous.
   */
  sanitizePost<
    P extends {
      isAnonymous?: boolean;
      user?: Pick<User, 'id' | 'name'> | null;
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

  /**
   * Sanitize a comment-like object by redacting user information when anonymous.
   * - If `isAnonymous` is true, sets `user` to `null` and removes `userId`.
   * - Returns a shallow copy preserving the generic type `C`.
   * @param comment Comment-like object that may include `isAnonymous`, `user`, and `userId`.
   * @returns Sanitized comment-like object with user info removed when anonymous.
   */
  sanitizeComment<
    C extends {
      isAnonymous?: boolean;
      user?: Pick<User, 'id' | 'name' | 'email'> | null;
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
}
