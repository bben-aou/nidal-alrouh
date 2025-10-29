import { CommunityStats, Post, SupportGroup } from '@/types/community';

export const mockCommunityStats: Omit<CommunityStats, 'icon' | 'label'>[] = [
  {
    value: '1,247',
    change: '+12%',
    color: 'text-blue-600',
  },
  {
    value: '89',
    change: '+5%',
    color: 'text-green-600',
  },
  {
    value: '456',
    change: '+18%',
    color: 'text-red-600',
  },
  {
    value: '3',
    change: 'This week',
    color: 'text-purple-600',
  },
];

export const mockRecentPosts: Post[] = [
  {
    id: '1',
    author: 'Sarah M.',
    avatar: 'SM',
    time: '2 hours ago',
    content:
      'Just wanted to share that I had my first therapy session today. Feeling hopeful for the first time in months. Thank you all for the encouragement! 💙',
    likes: 24,
    comments: 8,
    tags: ['therapy', 'hope'],
    hidden: false,
  },
  {
    id: '2',
    author: 'Ahmed K.',
    avatar: 'AK',
    time: '4 hours ago',
    content:
      'Does anyone have tips for managing anxiety during job interviews? I have one tomorrow and feeling overwhelmed.',
    likes: 15,
    comments: 12,
    tags: ['anxiety', 'career'],
    hidden: false,
  },
  {
    id: '3',
    author: 'Maria L.',
    avatar: 'ML',
    time: '6 hours ago',
    content:
      'Celebrating 30 days of consistent meditation practice! Small steps really do make a difference. 🧘‍♀️',
    likes: 42,
    comments: 6,
    tags: ['meditation', 'milestone'],
    hidden: false,
  },
];

export const mockSupportGroups: SupportGroup[] = [
  {
    name: 'Anxiety Support Circle',
    members: 234,
    description: 'A safe space to discuss anxiety management techniques',
    nextMeeting: 'Tomorrow, 7 PM',
    isJoined: true,
  },
  {
    name: 'Depression Recovery',
    members: 189,
    description: 'Supporting each other through depression recovery',
    nextMeeting: 'Friday, 6 PM',
    isJoined: false,
  },
  {
    name: 'Mindfulness & Meditation',
    members: 156,
    description: 'Exploring mindfulness practices together',
    nextMeeting: 'Sunday, 10 AM',
    isJoined: true,
  },
];
