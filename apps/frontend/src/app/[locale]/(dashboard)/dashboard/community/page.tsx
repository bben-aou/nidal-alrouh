'use client';

import { Plus, Search, Filter, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
import { mockRecentPosts, mockSupportGroups } from '@/lib/mock-data/community';

export default function DashboardCommunityPage() {
  const t = useTranslations('community');

  const handlePostSubmit = (content: string) => {
    // TODO: Implement post submission logic
    console.log('New post:', content);
  };

  const handlePostLike = (postId: number) => {
    // TODO: Implement like functionality
    console.log('Liked post:', postId);
  };

  const handlePostComment = (postId: number) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handlePostShare = (postId: number) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handlePostReport = (postId: number) => {
    // TODO: Implement report functionality
    console.log('Report post:', postId);
  };

  const handlePostHide = (postId: number) => {
    // TODO: Implement hide functionality
    console.log('Hide post:', postId);
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
          <CreatePostCard onPostSubmit={handlePostSubmit} />

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
            {mockRecentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onComment={handlePostComment}
                onShare={handlePostShare}
                onReport={handlePostReport}
                onHide={handlePostHide}
              />
            ))}
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
