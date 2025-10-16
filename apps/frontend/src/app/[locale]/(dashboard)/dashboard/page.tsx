'use client';

import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      title: t('stats.totalUsers'),
      value: '2,543',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: t('stats.appointments'),
      value: '156',
      change: '+8%',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: t('stats.messages'),
      value: '89',
      change: '+23%',
      icon: MessageSquare,
      color: 'text-purple-600',
    },
    {
      title: t('stats.growth'),
      value: '15.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: t('activities.newAppointment'),
      time: '2 minutes ago',
      icon: Calendar,
    },
    {
      id: 2,
      type: 'message',
      message: t('activities.newMessage'),
      time: '5 minutes ago',
      icon: MessageSquare,
    },
    {
      id: 3,
      type: 'user',
      message: t('activities.newUser'),
      time: '10 minutes ago',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('welcome')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('recentActivity')}
            </CardTitle>
            <CardDescription>{t('recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
            <CardDescription>{t('quickActionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {t('actions.scheduleAppointment')}
              </Button>
              <Button className="justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('actions.sendMessage')}
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                {t('actions.manageUsers')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
