import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import React from 'react';

// Types and Interfaces
export interface SupportOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  availability: string;
  action: string;
  color: string;
  bgColor: string;
}

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  questions: FAQQuestion[];
}

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'article';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  rating: number;
  views: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastUpdate: string;
}

// Mock Data
export const mockSupportOptions: SupportOption[] = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: 'Available 24/7',
    action: 'Start Chat',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with a support specialist',
    availability: 'Business Hours',
    action: 'Call Now',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message about your issue',
    availability: 'Response within 24h',
    action: 'Send Email',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export const mockFAQCategories: FAQCategory[] = [
  {
    id: 'account',
    title: 'Account Management',
    questions: [
      {
        id: 'reset-password',
        question: 'How do I reset my password?',
        answer:
          'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.',
      },
      {
        id: 'update-profile',
        question: 'How can I update my profile information?',
        answer:
          'Go to Settings > Profile to update your personal information, including your name, email, and profile picture.',
      },
      {
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer:
          'To delete your account, go to Settings > Account > Delete Account. Please note that this action is irreversible and all your data will be permanently removed.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    questions: [
      {
        id: 'data-security',
        question: 'How is my data protected?',
        answer:
          'We use industry-standard encryption and security measures to protect your data. All information is encrypted both in transit and at rest.',
      },
      {
        id: 'sharing-settings',
        question: 'Can I control who sees my journal entries?',
        answer:
          'Yes, you have full control over your privacy settings. You can make entries private, share with specific people, or keep them completely confidential.',
      },
    ],
  },
  {
    id: 'features',
    title: 'Features & Usage',
    questions: [
      {
        id: 'mood-tracking',
        question: 'How does mood tracking work?',
        answer:
          'Our mood tracking feature allows you to log your emotional state daily. Over time, you can view patterns and insights about your mental health journey.',
      },
      {
        id: 'journal-entries',
        question: 'Can I edit or delete journal entries?',
        answer:
          'Yes, you can edit or delete your journal entries at any time. Simply click on the entry and use the edit or delete options.',
      },
    ],
  },
];

export const mockTutorials: Tutorial[] = [
  {
    id: 1,
    title: 'Getting Started with Your Dashboard',
    description: 'Learn how to navigate and customize your personal dashboard.',
    type: 'video',
    duration: '5 min',
    difficulty: 'Beginner',
    thumbnail: '🎥',
    rating: 4.8,
    views: 1234,
  },
  {
    id: 2,
    title: 'Creating Your First Journal Entry',
    description: 'Step-by-step guide to writing and organizing your thoughts.',
    type: 'article',
    duration: '3 min read',
    difficulty: 'Beginner',
    thumbnail: '📝',
    rating: 4.9,
    views: 987,
  },
  {
    id: 3,
    title: 'Understanding Mood Tracking',
    description:
      'How to effectively track and analyze your emotional patterns.',
    type: 'video',
    duration: '8 min',
    difficulty: 'Intermediate',
    thumbnail: '📊',
    rating: 4.7,
    views: 756,
  },
  {
    id: 4,
    title: 'Privacy Settings and Data Control',
    description: 'Manage your privacy settings and control your data sharing.',
    type: 'article',
    duration: '4 min read',
    difficulty: 'Intermediate',
    thumbnail: '🔒',
    rating: 4.6,
    views: 543,
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'TK-001',
    subject: 'Unable to access mood tracking feature',
    status: 'open',
    priority: 'high',
    created: '2 hours ago',
    lastUpdate: '1 hour ago',
  },
  {
    id: 'TK-002',
    subject: 'Question about data export',
    status: 'resolved',
    priority: 'medium',
    created: '1 day ago',
    lastUpdate: '6 hours ago',
  },
  {
    id: 'TK-003',
    subject: 'Feature request: Dark mode',
    status: 'in_progress',
    priority: 'low',
    created: '3 days ago',
    lastUpdate: '2 days ago',
  },
];

// Utility Functions
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'text-red-600 bg-red-50';
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-50';
    case 'resolved':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusIcon = (
  status: string
): React.ComponentType<{ className?: string }> => {
  switch (status) {
    case 'open':
      return AlertCircle;
    case 'in_progress':
      return Clock;
    case 'resolved':
      return CheckCircle;
    default:
      return HelpCircle;
  }
};
