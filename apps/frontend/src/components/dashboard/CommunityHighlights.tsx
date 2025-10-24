'use client';

import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CommunityHighlights() {
  const t = useTranslations('dashboard');

  const communityPosts = [
    {
      content: t('communityHighlights.posts.0'),
      reactions: t('communityHighlights.reactions.0'),
    },
    {
      content: t('communityHighlights.posts.1'),
      reactions: t('communityHighlights.reactions.1'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('communityHighlights.title')}</CardTitle>
        <CardDescription>
          {t('communityHighlights.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {communityPosts.map((post, index) => (
          <div key={index} className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm">{post.content}</p>
            <div className="text-sm text-muted-foreground">
              {post.reactions}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
