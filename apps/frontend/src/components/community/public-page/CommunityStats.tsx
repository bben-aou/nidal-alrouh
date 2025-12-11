import { Users, MessageCircle, Calendar, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CommunityStats() {
  const t = useTranslations('community');

  const stats = [
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

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
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
  );
}
