'use client';

import { Plus } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

import { CommunityStats } from '@/components/community/CommunityStats';
import { EventsTab } from '@/components/community/EventsTab';
import { FeedTab } from '@/components/community/FeedTab';
import { GroupsTab } from '@/components/community/GroupsTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityFeed } from '@/hooks/use-community-feed';

export default function DashboardCommunityPage() {
  const t = useTranslations('community');
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>(
    'feed'
  );

  const {
    visiblePosts,
    isLoading,
    handlePostSubmit,
    handlePostLike,
    handlePostComment,
    handlePostShare,
    handlePostReport,
    handlePostHide,
    handlePostUnhide,
  } = useCommunityFeed({ locale, t });

  const handleJoinGroup = (groupName: string) => {
    // TODO: Implement join group functionality
    console.log('Join group:', groupName);
  };

  const handleViewGroup = (groupName: string) => {
    // TODO: Implement view group functionality
    console.log('View group:', groupName);
  };

  const triggerCreatePostComposer = () => {
    setActiveTab('feed');

    setTimeout(() => {
      const createPostElement = document.querySelector('[data-create-post]');
      if (!createPostElement) return;

      createPostElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const textarea = createPostElement.querySelector(
        'textarea'
      ) as HTMLTextAreaElement | null;
      textarea?.focus();

      const cardElement =
        createPostElement.firstElementChild as HTMLElement | null;
      if (cardElement) {
        cardElement.classList.add('ring-2', 'ring-primary');
        setTimeout(() => {
          cardElement.classList.remove('ring-2', 'ring-primary');
        }, 1200);
      }
    }, 10);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <Button className="w-fit" onClick={triggerCreatePostComposer}>
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.createPost')}
        </Button>
      </div>

      <CommunityStats />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'feed' | 'groups' | 'events')}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="feed">{t('dashboard.tabs.feed')}</TabsTrigger>
          <TabsTrigger value="groups">{t('dashboard.tabs.groups')}</TabsTrigger>
          <TabsTrigger value="events">{t('dashboard.tabs.events')}</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <FeedTab
            visiblePosts={visiblePosts}
            isLoading={isLoading}
            onPostSubmit={handlePostSubmit}
            onLike={handlePostLike}
            onComment={handlePostComment}
            onShare={handlePostShare}
            onReport={handlePostReport}
            onHide={handlePostHide}
            onUnhide={handlePostUnhide}
            onCreatePostFocus={triggerCreatePostComposer}
          />
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <GroupsTab
            onJoinGroup={handleJoinGroup}
            onViewGroup={handleViewGroup}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <EventsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
