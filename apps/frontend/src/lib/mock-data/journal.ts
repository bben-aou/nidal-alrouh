export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  date: string;
  time: string;
  tags: string[];
  isPrivate: boolean;
  wordCount: number;
  readTime: string;
}

export interface JournalStat {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
  color: string;
}

export interface MoodOption {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    title: 'A Productive Day at Work',
    content:
      'Today was one of those days where everything just clicked. I managed to complete all my tasks and even had time to help a colleague...',
    mood: 'good',
    date: '2024-01-15',
    time: '10:30 PM',
    tags: ['work', 'productivity', 'gratitude'],
    isPrivate: false,
    wordCount: 245,
    readTime: '2 min',
  },
  {
    id: 2,
    title: 'Feeling Overwhelmed',
    content:
      "The past few days have been challenging. I've been feeling overwhelmed with all the responsibilities and deadlines...",
    mood: 'anxious',
    date: '2024-01-14',
    time: '11:45 PM',
    tags: ['stress', 'anxiety', 'reflection'],
    isPrivate: true,
    wordCount: 189,
    readTime: '1 min',
  },
  {
    id: 3,
    title: 'Weekend Reflections',
    content:
      'Spent the weekend with family and friends. It reminded me of what truly matters in life. Sometimes we get so caught up...',
    mood: 'excellent',
    date: '2024-01-13',
    time: '9:15 PM',
    tags: ['family', 'gratitude', 'weekend'],
    isPrivate: false,
    wordCount: 312,
    readTime: '3 min',
  },
];

export const mockJournalPrompts: string[] = [
  "What are three things you're grateful for today?",
  'Describe a challenge you overcame recently.',
  'What would you tell your younger self?',
  'Write about a moment that made you smile today.',
  'What are your hopes for tomorrow?',
];

export const getMoodOptions = (t: (key: string) => string): MoodOption[] => [
  {
    value: 'excellent',
    label: t('dashboard.moods.excellent'),
    icon: '😄',
    color: 'text-green-600',
  },
  {
    value: 'good',
    label: t('dashboard.moods.good'),
    icon: '😊',
    color: 'text-blue-600',
  },
  {
    value: 'neutral',
    label: t('dashboard.moods.neutral'),
    icon: '😐',
    color: 'text-yellow-600',
  },
  {
    value: 'sad',
    label: t('dashboard.moods.sad'),
    icon: '😔',
    color: 'text-orange-600',
  },
  {
    value: 'anxious',
    label: t('dashboard.moods.anxious'),
    icon: '😰',
    color: 'text-red-600',
  },
];

export const getJournalStats = (
  t: (key: string) => string,
  icons: {
    BookOpen: React.ComponentType<{ className?: string }>;
    Calendar: React.ComponentType<{ className?: string }>;
    TrendingUp: React.ComponentType<{ className?: string }>;
    Clock: React.ComponentType<{ className?: string }>;
  }
): JournalStat[] => [
  {
    icon: icons.BookOpen,
    label: t('dashboard.stats.totalEntries'),
    value: '47',
    change: '+3',
    color: 'text-blue-600',
  },
  {
    icon: icons.Calendar,
    label: t('dashboard.stats.streakDays'),
    value: '12',
    change: '+1',
    color: 'text-green-600',
  },
  {
    icon: icons.TrendingUp,
    label: t('dashboard.stats.avgMood'),
    value: '7.2',
    change: '+0.3',
    color: 'text-purple-600',
  },
  {
    icon: icons.Clock,
    label: t('dashboard.stats.avgWriteTime'),
    value: '8m',
    change: '-2m',
    color: 'text-orange-600',
  },
];
