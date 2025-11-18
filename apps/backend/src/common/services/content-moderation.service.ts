import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import leoProfanity from 'leo-profanity';

@Injectable()
export class ContentModerationService {
  private readonly logger = new Logger(ContentModerationService.name);

  constructor() {
    leoProfanity.clearList();

    try {
      leoProfanity.add(leoProfanity.getDictionary('en'));
    } catch (error) {
      this.logger.warn('Failed to load English profanity dictionary', error);
    }

    try {
      leoProfanity.add(leoProfanity.getDictionary('fr'));
    } catch (error) {
      this.logger.warn('Failed to load French profanity dictionary', error);
    }
  }

  private readonly maxContentLength = 5000;
  private readonly maxCommentLength = 1000;
  private readonly minContentLength = 10;
  private readonly minCommentLength = 3;

  /**
   */
  moderatePostContent(content: string): { isValid: boolean; reason?: string } {
    if (content.length < this.minContentLength) {
      return {
        isValid: false,
        reason: `Content too short. Minimum ${this.minContentLength} characters required.`,
      };
    }

    if (content.length > this.maxContentLength) {
      return {
        isValid: false,
        reason: `Content too long. Maximum ${this.maxContentLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(content)) {
      return {
        isValid: false,
        reason: 'Content contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate comment content for inappropriate words and length
   */
  moderateCommentContent(content: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (content.length < this.minCommentLength) {
      return {
        isValid: false,
        reason: `Comment too short. Minimum ${this.minCommentLength} characters required.`,
      };
    }

    if (content.length > this.maxCommentLength) {
      return {
        isValid: false,
        reason: `Comment too long. Maximum ${this.maxCommentLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(content)) {
      return {
        isValid: false,
        reason: 'Comment contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate report reason for inappropriate words and length
   */
  moderateReportReason(reason: string): { isValid: boolean; reason?: string } {
    if (reason.length < 5) {
      return {
        isValid: false,
        reason: 'Report reason too short. Minimum 5 characters required.',
      };
    }

    if (reason.length > 500) {
      return {
        isValid: false,
        reason: 'Report reason too long. Maximum 500 characters allowed.',
      };
    }

    if (this.containsInappropriateLanguage(reason)) {
      return {
        isValid: false,
        reason: 'Report reason contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Check whether the content contains inappropriate language using leo-profanity
   */
  private containsInappropriateLanguage(content: string): boolean {
    return leoProfanity.check(content);
  }

  /**
   * Validate and throw exception if content is inappropriate
   */
  validatePostContent(content: string): void {
    const result = this.moderatePostContent(content);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if comment is inappropriate
   */
  validateCommentContent(content: string): void {
    const result = this.moderateCommentContent(content);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if report reason is inappropriate
   */
  validateReportReason(reason: string): void {
    const result = this.moderateReportReason(reason);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }
}
