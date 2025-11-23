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
  private readonly maxEventTitleLength = 100;
  private readonly minEventTitleLength = 5;
  private readonly maxEventDescriptionLength = 1000;
  private readonly minEventDescriptionLength = 20;
  private readonly maxEventTags = 10;
  private readonly maxTagLength = 30;
  private readonly minTagLength = 2;

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

  /**
   * Moderate event title for inappropriate words and length
   */
  moderateEventTitle(title: string): { isValid: boolean; reason?: string } {
    if (title.length < this.minEventTitleLength) {
      return {
        isValid: false,
        reason: `Event title too short. Minimum ${this.minEventTitleLength} characters required.`,
      };
    }

    if (title.length > this.maxEventTitleLength) {
      return {
        isValid: false,
        reason: `Event title too long. Maximum ${this.maxEventTitleLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(title)) {
      return {
        isValid: false,
        reason: 'Event title contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate event description for inappropriate words and length
   */
  moderateEventDescription(description: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (description.length < this.minEventDescriptionLength) {
      return {
        isValid: false,
        reason: `Event description too short. Minimum ${this.minEventDescriptionLength} characters required.`,
      };
    }

    if (description.length > this.maxEventDescriptionLength) {
      return {
        isValid: false,
        reason: `Event description too long. Maximum ${this.maxEventDescriptionLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(description)) {
      return {
        isValid: false,
        reason: 'Event description contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate event tags for inappropriate words, count, and individual tag length
   */
  moderateEventTags(tags: string[]): { isValid: boolean; reason?: string } {
    if (tags.length > this.maxEventTags) {
      return {
        isValid: false,
        reason: `Too many tags. Maximum ${this.maxEventTags} tags allowed.`,
      };
    }

    for (const tag of tags) {
      if (tag.length < this.minTagLength) {
        return {
          isValid: false,
          reason: `Tag "${tag}" too short. Minimum ${this.minTagLength} characters required.`,
        };
      }

      if (tag.length > this.maxTagLength) {
        return {
          isValid: false,
          reason: `Tag "${tag}" too long. Maximum ${this.maxTagLength} characters allowed.`,
        };
      }

      if (this.containsInappropriateLanguage(tag)) {
        return {
          isValid: false,
          reason: `Tag "${tag}" contains inappropriate language.`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate and throw exception if event title is inappropriate
   */
  validateEventTitle(title: string): void {
    const result = this.moderateEventTitle(title);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if event description is inappropriate
   */
  validateEventDescription(description: string): void {
    const result = this.moderateEventDescription(description);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if event tags are inappropriate
   */
  validateEventTags(tags: string[]): void {
    const result = this.moderateEventTags(tags);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  // ========================================
  // Resource Moderation Methods
  // ========================================

  private readonly maxResourceTitleLength = 200;
  private readonly minResourceTitleLength = 3;
  private readonly maxResourceDescriptionLength = 1000;
  private readonly minResourceDescriptionLength = 10;
  private readonly maxResourceContentLength = 50000; // For articles
  private readonly maxResourceTags = 10;

  /**
   * Moderate resource title for inappropriate words and length
   */
  moderateResourceTitle(title: string): { isValid: boolean; reason?: string } {
    if (title.length < this.minResourceTitleLength) {
      return {
        isValid: false,
        reason: `Resource title too short. Minimum ${this.minResourceTitleLength} characters required.`,
      };
    }

    if (title.length > this.maxResourceTitleLength) {
      return {
        isValid: false,
        reason: `Resource title too long. Maximum ${this.maxResourceTitleLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(title)) {
      return {
        isValid: false,
        reason: 'Resource title contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate resource description for inappropriate words and length
   */
  moderateResourceDescription(description: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (description.length < this.minResourceDescriptionLength) {
      return {
        isValid: false,
        reason: `Resource description too short. Minimum ${this.minResourceDescriptionLength} characters required.`,
      };
    }

    if (description.length > this.maxResourceDescriptionLength) {
      return {
        isValid: false,
        reason: `Resource description too long. Maximum ${this.maxResourceDescriptionLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(description)) {
      return {
        isValid: false,
        reason: 'Resource description contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate resource content (for articles) for inappropriate words and length
   */
  moderateResourceContent(content: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (content.length > this.maxResourceContentLength) {
      return {
        isValid: false,
        reason: `Resource content too long. Maximum ${this.maxResourceContentLength} characters allowed.`,
      };
    }

    if (this.containsInappropriateLanguage(content)) {
      return {
        isValid: false,
        reason: 'Resource content contains inappropriate language.',
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate resource tags for inappropriate words, count, and individual tag length
   */
  moderateResourceTags(tags: string[]): { isValid: boolean; reason?: string } {
    if (tags.length > this.maxResourceTags) {
      return {
        isValid: false,
        reason: `Too many tags. Maximum ${this.maxResourceTags} tags allowed.`,
      };
    }

    for (const tag of tags) {
      if (tag.length < this.minTagLength) {
        return {
          isValid: false,
          reason: `Tag "${tag}" too short. Minimum ${this.minTagLength} characters required.`,
        };
      }

      if (tag.length > this.maxTagLength) {
        return {
          isValid: false,
          reason: `Tag "${tag}" too long. Maximum ${this.maxTagLength} characters allowed.`,
        };
      }

      if (this.containsInappropriateLanguage(tag)) {
        return {
          isValid: false,
          reason: `Tag "${tag}" contains inappropriate language.`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate and throw exception if resource title is inappropriate
   */
  validateResourceTitle(title: string): void {
    const result = this.moderateResourceTitle(title);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if resource description is inappropriate
   */
  validateResourceDescription(description: string): void {
    const result = this.moderateResourceDescription(description);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if resource content is inappropriate
   */
  validateResourceContent(content: string): void {
    const result = this.moderateResourceContent(content);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }

  /**
   * Validate and throw exception if resource tags are inappropriate
   */
  validateResourceTags(tags: string[]): void {
    const result = this.moderateResourceTags(tags);
    if (!result.isValid) {
      throw new BadRequestException(result.reason);
    }
  }
}
