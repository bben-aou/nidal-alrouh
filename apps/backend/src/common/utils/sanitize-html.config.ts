import type { IOptions } from 'sanitize-html';

/**
 * Default sanitize-html options for rich text fields (posts, comments).
 * Allows basic formatting tags and discards disallowed content to prevent XSS.
 */
export const DEFAULT_SANITIZE_OPTIONS: IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

/**
 * Strict text-only sanitize-html options (no tags) for short inputs like report reasons.
 * Discards any HTML to ensure only plain text is persisted.
 */
export const STRICT_TEXT_ONLY_SANITIZE_OPTIONS: IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};
