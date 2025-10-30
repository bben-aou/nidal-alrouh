import * as z from 'zod';

// Function to create validation schemas with translations
export const createCommunitySchemas = (t: (key: string) => string) => {
  // Create post form schema
  const createPostSchema = z.object({
    content: z
      .string()
      .min(1, t('validation.contentRequired'))
      .min(10, t('validation.contentMinLength'))
      .max(5000, t('validation.contentMaxLength')),
    tags: z
      .array(z.string().min(1).max(50))
      .max(10, t('validation.tagsMaxCount')),
    isAnonymous: z.boolean(),
  });

  return {
    createPostSchema,
  };
};

// Fallback schema with English messages (for cases where translations aren't available)
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content cannot exceed 5000 characters'),
  tags: z.array(z.string().min(1).max(50)).max(10, 'You can add up to 10 tags'),
  isAnonymous: z.boolean(),
});

// Type exports
export type CreatePostFormData = z.infer<typeof createPostSchema>;
