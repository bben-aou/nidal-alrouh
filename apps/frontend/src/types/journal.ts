import { LucideIcon } from 'lucide-react';

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

export interface JournalStatsResponse {
  totalReflections: number;
  totalReflectionsChange: number;
  streakDays: number;
  streakDaysChange: number;
  avgMood: number;
  avgMoodChange: number;
  totalWords: number;
  totalWordsChange: number;
  period: {
    start: string;
    end: string;
  };
}

export type StatsPeriod = 'WEEK' | 'MONTH' | 'ALL' | 'CUSTOM';

export interface GetJournalStatsParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
  bgColor: string;
  iconBg: string;
  pattern: React.ReactNode;
  fromLastWeek: string;
}

export interface LoadingStateProps {
  count?: number;
}

export interface ErrorStateProps {
  count?: number;
  errorMessage?: string;
  tryAgainMessage?: string;
}

export interface JournalStatsData {
  totalReflections: number;
  totalReflectionsChange: number;
  streakDays: number;
  streakDaysChange: number;
  avgMood: number;
  avgMoodChange: number;
  totalWords: number;
  totalWordsChange: number;
}

// Analytics Types
export type TimeRangePreset = '7D' | '30D' | '90D' | 'CUSTOM';
export type Granularity = 'day' | 'week' | 'month';

export interface TimeRange {
  preset: TimeRangePreset;
  start: string;
  end: string;
  granularity: Granularity;
}

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
  averageMood: number;
  totalWords: number;
  streakDays: number;
}

export interface AnalyticsComparison {
  reflectionsChange?: number;
  moodChange?: number;
  wordsChange?: number;
}

export interface JournalAnalyticsResponse {
  totals: AnalyticsTotals;
  comparison: AnalyticsComparison;
  activityData: AnalyticsDataPoint[];
  moodData: MoodDataPoint[];
  wordsData: WordsDataPoint[];
}

export interface GetJournalAnalyticsParams {
  startDate: string;
  endDate: string;
  granularity: Granularity;
}

export interface AnalyticsControlsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  isLoading?: boolean;
}

export interface AnalyticsSummaryProps {
  data: AnalyticsTotals;
  comparison?: AnalyticsComparison;
  isLoading?: boolean;
}

export interface ChartProps {
  data: AnalyticsDataPoint[] | MoodDataPoint[] | WordsDataPoint[];
  isLoading?: boolean;
  isEmpty?: boolean;
}
