export interface ReflectionFormData {
  title: string;
  content: string;
  mood: string;
  tags: string[];
  isPrivate: boolean;
}

export interface CreateReflectionPayload {
  title: string;
  content: string;
  mood: string;
  tags: string[];
  privacy: 'PRIVATE' | 'PUBLIC';
  authorName: string;
  authorId: string;
}

export type PrivacyOption = 'private' | 'public';

export interface MoodOption {
  value: string;
  label: string;
  icon: string;
}

export interface TagInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  placeholder?: string;
  instructionText?: string;
}
