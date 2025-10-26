import { KeyboardEvent } from 'react';

import { CreateReflectionRequestBody } from '@/apis/journal/queries/use-create-reflection';
import { ReflectionFormData } from '@/types/journal';

/**
 * Handles tag input keyboard events for adding and removing tags
 */
export const handleTagInputKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
  tagInput: string,
  tags: string[],
  onTagAdd: (tag: string) => void,
  onTagRemove: () => void,
  onClearInput: () => void
) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      onTagAdd(newTag);
      onClearInput();
    }
  } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
    onTagRemove();
  }
};

/**
 * Validates if the reflection form data is complete and valid
 */
export const validateReflectionForm = (
  formData: Partial<ReflectionFormData>
): boolean => {
  return !!(
    formData.title?.trim() &&
    formData.content?.trim() &&
    formData.mood
  );
};

/**
 * Adds a new tag to the tags array if it doesn't already exist
 */
export const addTag = (newTag: string, currentTags: string[]): string[] => {
  const trimmedTag = newTag.trim();
  if (trimmedTag && !currentTags.includes(trimmedTag)) {
    return [...currentTags, trimmedTag];
  }
  return currentTags;
};

/**
 * Removes a tag from the tags array
 */
export const removeTag = (
  tagToRemove: string,
  currentTags: string[]
): string[] => {
  return currentTags.filter((tag) => tag !== tagToRemove);
};

/**
 * Removes the last tag from the tags array
 */
export const removeLastTag = (currentTags: string[]): string[] => {
  return currentTags.slice(0, -1);
};

/**
 * Resets form data to initial state
 */
export const getInitialFormData = (): ReflectionFormData => ({
  title: '',
  content: '',
  mood: '',
  tags: [],
  isPrivate: true,
});

/**
 * Prepares form data for submission by trimming strings and mapping to backend enums
 */
export const prepareFormDataForSubmission = (
  formData: ReflectionFormData
): CreateReflectionRequestBody => {
  const moodMap: Record<string, string> = {
    excellent: 'VERY_HAPPY',
    good: 'HAPPY',
    neutral: 'NEUTRAL',
    sad: 'SAD',
    anxious: 'SAD',
  };

  return {
    title: formData.title.trim(),
    content: formData.content.trim(),
    mood: moodMap[formData.mood] ?? 'NEUTRAL',
    tags: formData.tags,
    privacy: formData.isPrivate ? 'PRIVATE' : 'PUBLIC',
  };
};
