import { MessageCircle, Heart, Share2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function RecentDiscussions() {
  const t = useTranslations('community');

  const discussions = [
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

  return (
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
        {discussions.map((discussion, index) => (
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
  );
}
