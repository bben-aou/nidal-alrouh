import { PrivacyOption, ReflectionFormData } from '@/types/journal';

interface ApplyInitialFormValuesProps {
  initialTitle?: string;
  initialContent?: string;
  initialMood?: string;
  initialTags?: string[];
  initialPrivacy?: PrivacyOption;
  updateField: <K extends keyof ReflectionFormData>(
    field: K,
    value: ReflectionFormData[K]
  ) => void;
  setPrivacy: (privacy: PrivacyOption) => void;
}

export const applyInitialFormValues = ({
  initialTitle,
  initialContent,
  initialMood,
  initialTags,
  initialPrivacy,
  updateField,
  setPrivacy,
}: ApplyInitialFormValuesProps) => {
  if (initialTitle !== undefined) updateField('title', initialTitle);
  if (initialContent !== undefined) updateField('content', initialContent);
  if (initialMood !== undefined) updateField('mood', initialMood);
  if (initialTags !== undefined) updateField('tags', initialTags);
  if (initialPrivacy !== undefined) setPrivacy(initialPrivacy);
};
