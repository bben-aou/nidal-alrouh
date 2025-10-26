export interface JournalReflection {
  id: string | number;
  title: string;
  content: string;
  mood: string;
  date: string;
  time: string;
  tags: string[];
  isPrivate: boolean;
  wordCount: number;
  readTime: string;
  authorName: string;
  authorId: string;
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

export const mockJournalReflections: JournalReflection[] = [
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
    authorName: 'Demo User',
    authorId: 'mock-1',
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
    authorName: 'Demo User',
    authorId: 'mock-2',
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
    authorName: 'Demo User',
    authorId: 'mock-3',
  },
];

export interface JournalPrompt {
  text: string;
  tags: string[];
}

export type SupportedPromptLocale = 'en' | 'fr' | 'ar';

export const mockJournalPrompts: Record<
  SupportedPromptLocale,
  JournalPrompt[]
> = {
  en: [
    {
      text: "What are three things you're grateful for today?",
      tags: ['gratitude', 'reflection', 'positivity'],
    },
    {
      text: 'Describe a challenge you overcame recently.',
      tags: ['resilience', 'growth', 'challenge'],
    },
    {
      text: 'What would you tell your younger self?',
      tags: ['reflection', 'advice', 'self'],
    },
    {
      text: 'Write about a moment that made you smile today.',
      tags: ['joy', 'daily', 'gratitude'],
    },
    {
      text: 'What are your hopes for tomorrow?',
      tags: ['planning', 'hope', 'goals'],
    },
  ],
  fr: [
    {
      text: "Quelles sont trois choses pour lesquelles vous êtes reconnaissant aujourd'hui ?",
      tags: ['gratitude', 'réflexion', 'positivité'],
    },
    {
      text: 'Décrivez un défi que vous avez surmonté récemment.',
      tags: ['résilience', 'croissance', 'défi'],
    },
    {
      text: 'Que diriez-vous à votre vous plus jeune ?',
      tags: ['réflexion', 'conseil', 'soi'],
    },
    {
      text: 'Écrivez à propos d’un moment qui vous a fait sourire aujourd’hui.',
      tags: ['joie', 'quotidien', 'gratitude'],
    },
    {
      text: 'Quelles sont vos espérances pour demain ?',
      tags: ['planification', 'espoir', 'objectifs'],
    },
  ],
  ar: [
    {
      text: 'ما هي ثلاث أمور تشعر بالامتنان لها اليوم؟',
      tags: ['امتنان', 'تأمل', 'إيجابية'],
    },
    {
      text: 'صف تحديًا تغلبت عليه مؤخرًا.',
      tags: ['مرونة', 'نمو', 'تحدي'],
    },
    {
      text: 'ماذا تقول لنفسك في سن أصغر؟',
      tags: ['تأمل', 'نصيحة', 'ذات'],
    },
    {
      text: 'اكتب عن لحظة جعلتك تبتسم اليوم.',
      tags: ['فرح', 'يومي', 'امتنان'],
    },
    {
      text: 'ما هي آمالك ليوم الغد؟',
      tags: ['تخطيط', 'أمل', 'أهداف'],
    },
  ],
};

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
    label: t('dashboard.stats.totalReflections'),
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
