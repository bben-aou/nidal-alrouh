export interface AnalyticsDataPoint {
  date: string;
  value: number;
}

export interface MoodDataPoint {
  date: string;
  mood: number;
}

export interface WordsDataPoint {
  date: string;
  words: number;
}

export interface AnalyticsTotals {
  totalReflections: number;
  totalWords: number;
  averageMood: number;
  streakDays: number;
}

export interface AnalyticsComparison {
  reflectionsChange: number;
  wordsChange: number;
  moodChange: number;
}

export interface JournalAnalyticsResponseDto {
  totals: AnalyticsTotals;
  comparison: AnalyticsComparison;
  activityData: AnalyticsDataPoint[];
  moodData: MoodDataPoint[];
  wordsData: WordsDataPoint[];
}
