'use client';

import {
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Heart,
  Share2,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CommunityPage() {
  const t = useTranslations('community');

  const communityStats = [
    {
      icon: Users,
      label: t('stats.members'),
      value: '2,500+',
      color: 'text-blue-600',
    },
    {
      icon: MessageCircle,
      label: t('stats.discussions'),
      value: '850+',
      color: 'text-green-600',
    },
    {
      icon: Calendar,
      label: t('stats.events'),
      value: '45+',
      color: 'text-purple-600',
    },
    {
      icon: Heart,
      label: t('stats.support'),
      value: '24/7',
      color: 'text-red-600',
    },
  ];

  const upcomingEvents = [
    {
      title: t('events.mentalHealthWorkshop.title'),
      description: t('events.mentalHealthWorkshop.description'),
      date: '2024-02-15',
      time: '18:00',
      location: t('events.mentalHealthWorkshop.location'),
      attendees: 45,
      type: 'workshop',
    },
    {
      title: t('events.supportGroup.title'),
      description: t('events.supportGroup.description'),
      date: '2024-02-18',
      time: '19:30',
      location: t('events.supportGroup.location'),
      attendees: 28,
      type: 'support',
    },
    {
      title: t('events.wellnessSession.title'),
      description: t('events.wellnessSession.description'),
      date: '2024-02-22',
      time: '17:00',
      location: t('events.wellnessSession.location'),
      attendees: 62,
      type: 'wellness',
    },
  ];

  const recentDiscussions = [
    {
      title: t('discussions.copingStrategies.title'),
      author: 'Sarah M.',
      replies: 23,
      likes: 45,
      timeAgo: '2h ago',
      category: 'Mental Health',
    },
    {
      title: t('discussions.workLifeBalance.title'),
      author: 'Ahmed K.',
      replies: 18,
      likes: 32,
      timeAgo: '4h ago',
      category: 'Wellness',
    },
    {
      title: t('discussions.anxietySupport.title'),
      author: 'Maria L.',
      replies: 31,
      likes: 67,
      timeAgo: '6h ago',
      category: 'Support',
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-500/10 text-blue-600';
      case 'support':
        return 'bg-green-500/10 text-green-600';
      case 'wellness':
        return 'bg-purple-500/10 text-purple-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            {t('hero.joinCommunity')}
          </Button>
          <Button variant="outline" size="lg">
            {t('hero.browseDiscussions')}
          </Button>
        </div>
      </section>

      {/* Community Stats */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {communityStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <Icon className={`h-8 w-8 mx-auto ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Upcoming Events */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {t('events.title')}
            </h2>
            <p className="text-muted-foreground">{t('events.subtitle')}</p>
          </div>
          <Button variant="outline">
            {t('events.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{event.date}</div>
                    <div>{event.time}</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{event.description}</CardDescription>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.attendees} {t('events.attendees')}
                  </div>
                </div>

                <Button className="w-full">{t('events.joinEvent')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {t('discussions.title')}
            </h2>
            <p className="text-muted-foreground">{t('discussions.subtitle')}</p>
          </div>
          <Button variant="outline">
            {t('discussions.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {recentDiscussions.map((discussion, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {discussion.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {discussion.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {discussion.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {discussion.author
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{discussion.author}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{discussion.likes}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t('guidelines.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('guidelines.description')}
          </p>
          <Button variant="outline">{t('guidelines.readMore')}</Button>
        </div>
      </section>
    </div>
  );
}
