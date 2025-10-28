import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ContentModerationService {
  private readonly blockedWords = [
    // English profanity and inappropriate content
    'fuck',
    'shit',
    'damn',
    'bitch',
    'asshole',
    'bastard',
    'crap',
    'piss',
    'whore',
    'slut',
    'faggot',
    'nigger',
    'retard',
    'cunt',
    'cock',
    'dick',
    'pussy',
    'tits',
    'ass',
    'nazi',
    'hitler',
    'terrorist',
    'bomb',
    'kill',
    'suicide',
    'rape',
    'murder',
    'violence',
    'hate',
    'racist',
    'sexist',

    // Arabic profanity and inappropriate content (transliterated)
    'khawal',
    'sharmouta',
    'kalb',
    'himar',
    'khara',
    'ayr',
    'tiz',
    'kos',
    'maniak',
    'majnoun',
    'haram',
    'kafir',
    'munafiq',
    'fasiq',
    'zalim',

    // Spam and promotional content
    'viagra',
    'casino',
    'lottery',
    'winner',
    'congratulations',
    'prize',
    'click here',
    'buy now',
    'limited time',
    'act now',
    'free money',
    'get rich',
    'make money fast',
    'work from home',
    'lose weight fast',

    // Harmful content
    'self harm',
    'cut yourself',
    'end it all',
    'worthless',
    'nobody cares',
    'drugs',
    'cocaine',
    'heroin',
    'marijuana',
    'weed',
    'alcohol abuse',
  ];

  private readonly maxContentLength = 5000; // Maximum content length
  private readonly maxCommentLength = 1000; // Maximum comment length
  private readonly minContentLength = 10; // Minimum content length
  private readonly minCommentLength = 3; // Minimum comment length

  /**
   * Moderate post content for inappropriate words and length
   */
  moderatePostContent(content: string): { isValid: boolean; reason?: string } {
    // Check length constraints
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

    // Check for blocked words
    const blockedWord = this.findBlockedWords(content);
    if (blockedWord) {
      return {
        isValid: false,
        reason: `Content contains inappropriate language: "${blockedWord}"`,
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
    // Check length constraints
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

    // Check for blocked words
    const blockedWord = this.findBlockedWords(content);
    if (blockedWord) {
      return {
        isValid: false,
        reason: `Comment contains inappropriate language: "${blockedWord}"`,
      };
    }

    return { isValid: true };
  }

  /**
   * Moderate report reason for inappropriate words and length
   */
  moderateReportReason(reason: string): { isValid: boolean; reason?: string } {
    // Check length constraints (reports should be concise)
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

    // Check for blocked words (less strict for reports)
    const blockedWord = this.findBlockedWords(reason);
    if (blockedWord) {
      return {
        isValid: false,
        reason: `Report reason contains inappropriate language: "${blockedWord}"`,
      };
    }

    return { isValid: true };
  }

  /**
   * Find blocked words in content (case-insensitive)
   */
  private findBlockedWords(content: string): string | null {
    const normalizedContent = content.toLowerCase();

    for (const word of this.blockedWords) {
      // Check for exact word matches (with word boundaries)
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
      if (regex.test(normalizedContent)) {
        return word;
      }

      // Check for variations with special characters
      const variations = [
        word.replace(/[aeiou]/g, '*'), // Replace vowels with *
        word.replace(/./g, (char, index) => (index % 2 === 0 ? char : '*')), // Every other char
        word.split('').join('*'), // Add * between chars
        word.replace(/s/g, '$'), // Common substitutions
        word.replace(/a/g, '@'),
        word.replace(/e/g, '3'),
        word.replace(/i/g, '1'),
        word.replace(/o/g, '0'),
      ];

      for (const variation of variations) {
        if (normalizedContent.includes(variation.toLowerCase())) {
          return word;
        }
      }
    }

    return null;
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
