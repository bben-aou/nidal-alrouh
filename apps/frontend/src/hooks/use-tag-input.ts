import { useState } from 'react';

export function useTagInput(
  getTags: () => string[],
  setTags: (tags: string[]) => void
) {
  const [tagInput, setTagInput] = useState('');

  const handleTagAdd = (tag: string) => {
    const value = tag.trim();
    if (!value) return;
    const current = getTags();
    if (current.includes(value)) return;
    setTags([...current, value]);
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    const current = getTags();
    setTags(current.filter((t) => t !== tagToRemove));
  };

  return { tagInput, setTagInput, handleTagAdd, handleTagRemove };
}
