import { z } from 'zod';

// Base resource schema
const baseResourceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  type: z.enum(['ARTICLE', 'VIDEO', 'LINK']),
  content: z.string().max(50000).optional(),
  url: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().min(2).max(30)).max(10),
});

// Function to create validation schemas with translations
export const createResourceSchemas = (t: (key: string) => string) => {
  const createResourceSchema = z
    .object({
      title: z
        .string()
        .min(1, t('validation.titleRequired'))
        .min(3, t('validation.titleMinLength'))
        .max(200, t('validation.titleMaxLength')),
      description: z
        .string()
        .min(1, t('validation.descriptionRequired'))
        .min(10, t('validation.descriptionMinLength'))
        .max(1000, t('validation.descriptionMaxLength')),
      type: z.enum(['ARTICLE', 'VIDEO', 'LINK']),
      content: z
        .string()
        .max(50000, t('validation.contentMaxLength'))
        .optional()
        .or(z.literal('')),
      url: z.string().optional().or(z.literal('')),
      tags: z
        .array(
          z
            .string()
            .min(2, t('validation.tagMinLength'))
            .max(30, t('validation.tagMaxLength'))
        )
        .max(10, t('validation.tagsMaxCount')),
    })
    .refine(
      (data) => {
        // Article must have content
        if (data.type === 'ARTICLE') {
          return data.content && data.content.length > 0;
        }
        return true;
      },
      {
        path: ['content'],
        message: t('validation.contentRequired'),
      }
    )
    .refine(
      (data) => {
        // Video and Link must have URL
        if (data.type === 'VIDEO' || data.type === 'LINK') {
          return data.url && data.url.length > 0;
        }
        return true;
      },
      {
        path: ['url'],
        message: t('validation.urlRequired'),
      }
    )
    .refine(
      (data) => {
        // Only validate URL format if URL is provided
        if (data.url && data.url.length > 0) {
          try {
            new URL(data.url);
            return true;
          } catch {
            return false;
          }
        }
        return true;
      },
      {
        path: ['url'],
        message: t('validation.urlInvalid'),
      }
    );

  return {
    createResourceSchema,
  };
};

// Fallback schema with English messages
export const createResourceSchema = baseResourceSchema
  .extend({
    title: z
      .string()
      .min(1, 'Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description cannot exceed 1000 characters'),
    content: z
      .string()
      .max(50000, 'Content cannot exceed 50000 characters')
      .optional()
      .or(z.literal('')),
    url: z
      .string()
      .url({ message: 'Please enter a valid URL' })
      .optional()
      .or(z.literal('')),
    tags: z
      .array(
        z
          .string()
          .min(2, 'Tag must be at least 2 characters')
          .max(30, 'Tag cannot exceed 30 characters')
      )
      .max(10, 'You can add up to 10 tags'),
  })
  .refine(
    (data) => {
      if (data.type === 'ARTICLE') {
        return data.content && data.content.length > 0;
      }
      return true;
    },
    {
      path: ['content'],
      message: 'Content is required for articles',
    }
  )
  .refine(
    (data) => {
      if (data.type === 'VIDEO' || data.type === 'LINK') {
        return data.url && data.url.length > 0;
      }
      return true;
    },
    {
      path: ['url'],
      message: 'URL is required for videos and links',
    }
  );

// Type exports
export type CreateResourceFormData = z.infer<typeof createResourceSchema>;
