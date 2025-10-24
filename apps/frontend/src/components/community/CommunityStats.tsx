'use client';

import { Users, MessageCircle, Calendar, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  mockCommunityStats,
  type CommunityStats,
} from '@/lib/mock-data/community';

interface CommunityStatsProps {
  className?: string;
}

export function CommunityStats({ className }: Readonly<CommunityStatsProps>) {
  const t = useTranslations('community');

  const icons = [Users, MessageCircle, Heart, Calendar];
  const labels = [
    t('stats.activeMembers'),
    t('stats.todayPosts'),
    t('stats.supportGiven'),
    t('stats.upcomingEvents'),
  ];

  const communityStats: CommunityStats[] = mockCommunityStats.map(
    (stat, index) => ({
      ...stat,
      icon: icons[index],
      label: labels[index],
    })
  );

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
    >
      {communityStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
