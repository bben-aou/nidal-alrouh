import { Smile, SmilePlus, Meh, Frown, AlertCircle } from 'lucide-react';
import React from 'react';

import { ReflectionItem } from '@/apis/journal/queries/use-get-reflections';
import { JournalReflection } from '@/lib/mock-data/journal';

/**
 * Transform API reflection data to match the JournalReflection interface
 * @param apiData - Raw API response data
 * @returns Transformed reflection data
 */
export function transformReflectionData(
  apiData: ReflectionItem[],
  locale: string = 'en'
): JournalReflection[] {
  return (apiData || []).map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    mood: item.mood,
    date: new Date(item.createdAt).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: new Date(item.createdAt).toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    tags: item.tags || [],
    isPrivate: item.privacy === 'PRIVATE',
    wordCount: item.content.split(' ').length,
    readTime: `${Math.ceil(item.content.split(' ').length / 200)} min`,
    authorName: item.user?.name ?? item.user?.email ?? '',
    authorId: item.user?.id ?? '',
  }));
}

/**
 * Calculate reading time based on word count
 * @param content - Text content
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time string
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  const wordCount = content.split(' ').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

/**
 * Format date for journal entries
 * @param date - Date object or ISO string
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatJournalDate(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Format time for journal entries
 * @param date - Date object or ISO string
 * @param locale - Locale for time formatting (default: 'en-US')
 * @returns Formatted time string
 */
export function formatJournalTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get the appropriate Lucide icon component for a given mood with specific colors
 * @param icon - The icon name from the mood option
 * @returns React component for the mood icon with appropriate color
 */
export function getMoodIcon(icon: string): React.ReactElement | null {
  const iconMap: Record<
    string,
    { component: React.ComponentType<{ className?: string }>; color: string }
  > = {
    smile: { component: Smile, color: 'text-green-600' },
    'smile-plus': { component: SmilePlus, color: 'text-blue-600' },
    meh: { component: Meh, color: 'text-yellow-600' },
    frown: { component: Frown, color: 'text-orange-600' },
    'alert-circle': { component: AlertCircle, color: 'text-red-600' },
  };

  const iconData = iconMap[icon];
  return iconData
    ? React.createElement(iconData.component, {
        className: `h-4 w-4 ${iconData.color}`,
      })
    : null;
}
