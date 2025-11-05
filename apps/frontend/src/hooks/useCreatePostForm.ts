import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';

import {
  createCommunitySchemas,
  type CreatePostFormData,
} from '@/lib/validations/community';

interface UseCreatePostFormProps {
  onPostSubmit?: (data: CreatePostFormData) => void;
  onAfterSubmit?: () => void;
}

export function useCreatePostForm({
  onPostSubmit,
  onAfterSubmit,
}: UseCreatePostFormProps = {}) {
  const t = useTranslations('community');
  const [tagInput, setTagInput] = useState('');
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);

  const { createPostSchema } = createCommunitySchemas(t);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      tags: [],
      isAnonymous: false,
    },
    mode: 'onChange',
  });

  const watchedContent = watch('content');
  const watchedTags = watch('tags');
  const watchedIsAnonymous = watch('isAnonymous');

  const onSubmit = (data: CreatePostFormData) => {
    onPostSubmit?.(data);
    reset();
    setTagInput('');
    onAfterSubmit?.();
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (
      trimmedTag &&
      !watchedTags.includes(trimmedTag) &&
      watchedTags.length < 5
    ) {
      setValue('tags', [...watchedTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setValue(
      'tags',
      watchedTags.filter((_, i) => i !== index)
    );
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (
      e.key === 'Backspace' &&
      tagInput === '' &&
      watchedTags.length > 0
    ) {
      removeTag(watchedTags.length - 1);
    }
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTag();
    }
    setIsTagInputFocused(false);
  };

  const handleTagInputFocus = () => {
    setIsTagInputFocused(true);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAnonymousToggle = (checked: boolean) => {
    setValue('isAnonymous', checked);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    setValue,

    watchedContent,
    watchedTags,
    watchedIsAnonymous,

    tagInput,
    isTagInputFocused,

    addTag,
    removeTag,

    handleTagInputKeyDown,
    handleTagInputBlur,
    handleTagInputFocus,
    handleTagInputChange,
    handleAnonymousToggle,
  };
}
