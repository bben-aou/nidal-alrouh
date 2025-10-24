import { BookOpen, Video, FileText, Headphones } from 'lucide-react';
import React from 'react';

// Type definitions for resources
export interface ResourceStats {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  total: string;
  progress: number;
  color: string;
}

export interface Resource {
  id: number;
  type: 'article' | 'video' | 'podcast' | 'guide';
  title: string;
  description: string;
  author: string;
  readTime: string;
  rating: number;
  isBookmarked: boolean;
  isCompleted: boolean;
  tags: string[];
  thumbnail: string;
}

export interface Bookmark {
  id: number;
  title: string;
  type: 'article' | 'video' | 'podcast' | 'guide';
  addedDate: string;
  progress: number;
}

export interface RecentlyViewedItem {
  id: number;
  title: string;
  type: 'article' | 'video' | 'podcast' | 'guide';
  viewedDate: string;
  thumbnail: string;
}

// Mock data for personalized stats (without labels as they come from translations)
export const mockResourceStats: Omit<ResourceStats, 'label'>[] = [
  {
    icon: BookOpen,
    value: '12',
    total: '25',
    progress: 48,
    color: 'text-blue-600',
  },
  {
    icon: Video,
    value: '8',
    total: '15',
    progress: 53,
    color: 'text-red-600',
  },
  {
    icon: Headphones,
    value: '5',
    total: '12',
    progress: 42,
    color: 'text-green-600',
  },
  {
    icon: FileText,
    value: '3',
    total: '8',
    progress: 38,
    color: 'text-purple-600',
  },
];

// Mock data for recommended resources
export const mockRecommendedResources: Resource[] = [
  {
    id: 1,
    type: 'article',
    title: 'Understanding Anxiety: A Complete Guide',
    description:
      'Learn about the different types of anxiety and effective coping strategies.',
    author: 'Dr. Sarah Johnson',
    readTime: '8 min read',
    rating: 4.8,
    isBookmarked: false,
    isCompleted: false,
    tags: ['anxiety', 'coping', 'mental-health'],
    thumbnail: '📚',
  },
  {
    id: 2,
    type: 'video',
    title: 'Mindfulness Meditation for Beginners',
    description:
      'A guided meditation session to help you start your mindfulness journey.',
    author: 'Mindful Living',
    readTime: '15 min',
    rating: 4.9,
    isBookmarked: true,
    isCompleted: true,
    tags: ['meditation', 'mindfulness', 'relaxation'],
    thumbnail: '🎥',
  },
  {
    id: 3,
    type: 'podcast',
    title: 'Overcoming Depression: Real Stories',
    description:
      'Listen to inspiring stories of people who overcame depression.',
    author: 'Mental Health Matters',
    readTime: '32 min',
    rating: 4.7,
    isBookmarked: true,
    isCompleted: false,
    tags: ['depression', 'recovery', 'inspiration'],
    thumbnail: '🎧',
  },
];

// Mock data for bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: 1,
    title: 'Breathing Exercises for Panic Attacks',
    type: 'guide',
    addedDate: '2 days ago',
    progress: 75,
  },
  {
    id: 2,
    title: 'Sleep Hygiene Checklist',
    type: 'article',
    addedDate: '1 week ago',
    progress: 100,
  },
  {
    id: 3,
    title: 'Cognitive Behavioral Therapy Basics',
    type: 'video',
    addedDate: '2 weeks ago',
    progress: 30,
  },
];

// Mock data for recently viewed items
export const mockRecentlyViewed: RecentlyViewedItem[] = [
  {
    id: 1,
    title: 'Managing Work Stress',
    type: 'article',
    viewedDate: 'Today',
    thumbnail: '💼',
  },
  {
    id: 2,
    title: 'Building Self-Esteem',
    type: 'video',
    viewedDate: 'Yesterday',
    thumbnail: '💪',
  },
];

// Utility function to get type icon
export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'article':
      return BookOpen;
    case 'video':
      return Video;
    case 'podcast':
      return Headphones;
    case 'guide':
      return FileText;
    default:
      return BookOpen;
  }
};
