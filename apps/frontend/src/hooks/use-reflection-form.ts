'use client';

import { useState } from 'react';

import { ReflectionFormData, PrivacyOption } from '@/types/journal';
import {
  validateReflectionForm,
  addTag,
  removeTag,
  getInitialFormData,
  prepareFormDataForSubmission,
} from '@/utils/journal';

export function useReflectionForm() {
  const [formData, setFormData] =
    useState<ReflectionFormData>(getInitialFormData());
  const [tagInput, setTagInput] = useState('');

  const updateField = <K extends keyof ReflectionFormData>(
    field: K,
    value: ReflectionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (newTag: string) => {
    const updatedTags = addTag(newTag, formData.tags);
    updateField('tags', updatedTags);
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = removeTag(tagToRemove, formData.tags);
    updateField('tags', updatedTags);
  };

  const setPrivacy = (privacy: PrivacyOption) => {
    updateField('isPrivate', privacy === 'private');
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setTagInput('');
  };

  const getSubmissionData = () => {
    return prepareFormDataForSubmission(formData);
  };

  const isFormValid = validateReflectionForm(formData);

  return {
    // Form data
    formData,
    tagInput,
    isFormValid,

    // Form actions
    updateField,
    setTagInput,
    handleTagAdd,
    handleTagRemove,
    setPrivacy,
    resetForm,
    getSubmissionData,

    // Computed values
    privacy: formData.isPrivate
      ? ('private' as PrivacyOption)
      : ('public' as PrivacyOption),
  };
}
