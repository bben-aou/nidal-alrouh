'use client';

import { Plus, Search, Filter, Calendar, MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';

import {
  useHidePost,
  useUnhidePost,
  useGetPosts,
  useCreatePost,
} from '@/apis/community/queries';
import { CommunityStats } from '@/components/community/CommunityStats';
import { CreatePostCard } from '@/components/community/CreatePostCard';
import { PostCard } from '@/components/community/PostCard';
import { SupportGroupCard } from '@/components/community/SupportGroupCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityRealtime } from '@/hooks/use-community-realtime';
import { mockSupportGroups } from '@/lib/mock-data/community';
import { transformCommunityPosts } from '@/lib/utils/community';
import { type Post } from '@/types/community';

export default function DashboardCommunityPage() {
  const t = useTranslations('community');
  const locale = useLocale();
  const hidePostMutation = useHidePost();
  const unhidePostMutation = useUnhidePost();
  const createPostMutation = useCreatePost();

  // Fetch server posts and seed local UI state
  const { posts: serverPosts, isLoading } = useGetPosts({
    params: { limit: 20 },
  });
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (serverPosts?.length) {
      setPosts(transformCommunityPosts(serverPosts, t));
    }
  }, [serverPosts, t]);

  // Realtime: handle post creation, hiding, and unhiding
  useCommunityRealtime({
    onPostCreated: (newPost) => {
      setPosts((prev) => {
        // Check if post already exists to prevent duplicates
        const existingPost = prev.find((p) => p.id === newPost.id);
        if (existingPost) {
          return prev; // Don't add duplicate
        }
        return [newPost, ...prev];
      });
    },
    onPostHidden: (postId) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, hidden: true } : post
        )
      );
    },
    onPostUnhidden: (postId) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, hidden: false } : post
        )
      );
    },
    t,
  });
  const visiblePosts = useMemo(() => posts.filter((p) => !p.hidden), [posts]);

  const handlePostSubmit = (data: {
    content: string;
    tags: string[];
    isAnonymous: boolean;
  }) => {
    createPostMutation.mutate(
      {
        content: data.content,
        tags: data.tags,
        locale,
        isAnonymous: data.isAnonymous,
      },
      {
        onSuccess: (resp) => {
          toast.success(
            resp?.message || t('dashboard.messages.createPostSuccess')
          );
        },
        onError: (error) => {
          toast.error(error.message || t('dashboard.messages.createPostError'));
        },
      }
    );
  };

  const handlePostLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Liked post:', postId);
  };

  const handlePostComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handlePostShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handlePostReport = (postId: string) => {
    // TODO: Implement report functionality
    console.log('Report post:', postId);
  };

  //TODO: make sure that the hidden post are gotten filtered out from the backend
  const handlePostHide = (postId: string) => {
    // Optimistically hide locally
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hidden: true } : p))
    );

    hidePostMutation.mutate(
      { postId },
      {
        onError: (error) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, hidden: false } : p))
          );
          toast.error(error.message || t('dashboard.messages.hidePostError'));
        },
        onSuccess: (data) => {
          toast.success(
            data.message || t('dashboard.messages.hidePostSuccess')
          );
        },
      }
    );
  };

  const handlePostUnhide = (postId: string) => {
    // Optimistically unhide locally
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hidden: false } : p))
    );

    unhidePostMutation.mutate(
      { postId },
      {
        onError: (error) => {
          // Roll back local change if API fails
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, hidden: true } : p))
          );
          toast.error(error.message || t('dashboard.messages.unhidePostError'));
        },
        onSuccess: (data) => {
          toast.success(
            data.message || t('dashboard.messages.unhidePostSuccess')
          );
        },
      }
    );
  };

  const handleJoinGroup = (groupName: string) => {
    // TODO: Implement join group functionality
    console.log('Join group:', groupName);
  };

  const handleViewGroup = (groupName: string) => {
    // TODO: Implement view group functionality
    console.log('View group:', groupName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.createPost')}
        </Button>
      </div>

      {/* Stats */}
      <CommunityStats />

      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">{t('dashboard.tabs.feed')}</TabsTrigger>
          <TabsTrigger value="groups">{t('dashboard.tabs.groups')}</TabsTrigger>
          <TabsTrigger value="events">{t('dashboard.tabs.events')}</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Create Post */}
          <div data-create-post>
            <CreatePostCard onPostSubmit={handlePostSubmit} />
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('dashboard.searchPosts')}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t('dashboard.filter')}
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">
                  {t('dashboard.emptyState.loading')}
                </div>
              </div>
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handlePostLike}
                  onComment={handlePostComment}
                  onShare={handlePostShare}
                  onReport={handlePostReport}
                  onHide={handlePostHide}
                  onUnhide={handlePostUnhide}
                />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t('dashboard.emptyState.title')}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-sm">
                    {t('dashboard.emptyState.description')}
                  </p>
                  <Button
                    onClick={() => {
                      // Focus on the create post card
                      const createPostElement =
                        document.querySelector('[data-create-post]');
                      createPostElement?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('dashboard.emptyState.createFirstPost')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockSupportGroups.map((group, index) => (
              <SupportGroupCard
                key={index}
                group={group}
                onJoinGroup={handleJoinGroup}
                onViewGroup={handleViewGroup}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
              <CardDescription>
                {t('dashboard.eventsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('dashboard.noEvents')}
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('dashboard.createEvent')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
