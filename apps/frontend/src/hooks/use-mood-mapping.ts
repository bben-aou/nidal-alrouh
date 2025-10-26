'use client';

import { useTranslations } from 'next-intl';

import { getMoodOptions } from '@/lib/utils/journal';

export function useMoodMapping() {
  const t = useTranslations('journal');
  const moodOptions = getMoodOptions(t);

  // Map backend mood values to frontend mood values
  const mapBackendMoodToFrontend = (backendMood: string): string => {
    const moodMapping: Record<string, string> = {
      VERY_HAPPY: 'excellent',
      HAPPY: 'good',
      NEUTRAL: 'neutral',
      SAD: 'sad',
      VERY_SAD: 'anxious',
    };
    return moodMapping[backendMood] || 'neutral';
  };

  const getMoodOption = (mood: string) => {
    const frontendMood = mapBackendMoodToFrontend(mood);
    return moodOptions.find((m) => m.value === frontendMood);
  };

  const getMoodLabel = (mood: string) => {
    const moodOption = getMoodOption(mood);
    return moodOption?.label || 'Neutral';
  };

  const getMoodColor = (mood: string) => {
    const moodOption = getMoodOption(mood);
    return moodOption?.color || 'text-gray-600';
  };

  const getMoodIcon = (mood: string) => {
    const moodOption = getMoodOption(mood);
    return moodOption?.icon || 'meh';
  };

  return {
    moodOptions,
    mapBackendMoodToFrontend,
    getMoodOption,
    getMoodLabel,
    getMoodColor,
    getMoodIcon,
  };
}
