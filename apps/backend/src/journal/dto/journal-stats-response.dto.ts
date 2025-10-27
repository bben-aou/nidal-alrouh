export interface JournalStatsResponse {
  totalReflections: number;
  totalReflectionsChange: number;
  streakDays: number;
  avgMood: number;
  avgMoodChange: number;
  totalWords: number;
  totalWordsChange: number;
  period: {
    start: string;
    end: string;
  };
}
