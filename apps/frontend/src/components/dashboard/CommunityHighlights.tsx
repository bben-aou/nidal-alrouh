'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';

import { CommunityEmptyState } from '@/components/dashboard/CommunityEmptyState';
import { CommunityPostCard } from '@/components/dashboard/CommunityPostCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCommunityRealtime } from '@/hooks/use-community-realtime';
import {
  CommunityApiService,
  type CommunityPost,
} from '@/services/community-api.service';

export function CommunityHighlights() {
  const t = useTranslations('dashboard');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CommunityApiService.getPosts({
        limit: 3,
      });
      setPosts(response?.items || []);
    } catch (error) {
      console.error('Failed to fetch community posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useCommunityRealtime({
    onPostCreated: () => {
      fetchPosts();
    },
    onPostDeleted: () => {
      fetchPosts();
    },
    t: (key: string) => key,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('communityHighlights.title')}</CardTitle>
        <CardDescription>
          {t('communityHighlights.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <CommunityPostCard key={post.id} post={post} />)
        ) : (
          <CommunityEmptyState />
        )}
      </CardContent>
    </Card>
  );
}
