'use client';

import { Search, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceCreationDialog } from '@/components/resources/ResourceCreationDialog';
import ResourceStats from '@/components/resources/ResourceStats';
import { AllResourcesTab } from '@/components/resources/tabs/AllResourcesTab';
import { BookmarksTab } from '@/components/resources/tabs/BookmarksTab';
import { RecentTab } from '@/components/resources/tabs/RecentTab';
import { RecommendedTab } from '@/components/resources/tabs/RecommendedTab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResourcesDashboard } from '@/hooks/use-resources-dashboard';

export default function DashboardResourcesPage() {
  const t = useTranslations('resources');
  const {
    searchTerm,
    setSearchTerm,
    recommendedResources,
    allResources,
    bookmarks,
    recentViews,
    trendingResources,
    loadingRecommended,
    loadingBookmarks,
    loadingRecent,
    loadingAll,
    loadingTrending,
    loadingMoreRecommended,
    loadingMoreAll,
    loadingMoreBookmarks,
    loadingMoreRecent,
    hasMoreRecommended,
    hasMoreAll,
    hasMoreBookmarks,
    hasMoreRecent,
    fetchAllResources,
    fetchTrendingResources,
    loadMoreRecommended,
    loadMoreAll,
    loadMoreBookmarks,
    loadMoreRecent,
    handleBookmark,
    handleView,
    handleTabChange,
  } = useResourcesDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <div className="flex gap-2">
          <ResourceCreationDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('creation.title')}
            </Button>
          </ResourceCreationDialog>
          <Button
            variant="outline"
            onClick={fetchTrendingResources}
            disabled={loadingTrending}
          >
            {loadingTrending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            {t('dashboard.trending')}
          </Button>
        </div>
      </div>

      <ResourceStats />

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('dashboard.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs
        defaultValue="recommended"
        className="space-y-4"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="recommended">
            {t('dashboard.tabs.recommended')}
          </TabsTrigger>
          <TabsTrigger value="bookmarks">
            {t('dashboard.tabs.bookmarks')}
          </TabsTrigger>
          <TabsTrigger value="recent">{t('dashboard.tabs.recent')}</TabsTrigger>
          <TabsTrigger value="all">{t('dashboard.tabs.all')}</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          <RecommendedTab
            resources={recommendedResources}
            loading={loadingRecommended}
            onBookmark={handleBookmark}
            onView={handleView}
            onLoadMore={loadMoreRecommended}
            hasMore={hasMoreRecommended}
            loadingMore={loadingMoreRecommended}
          />
        </TabsContent>

        <TabsContent value="bookmarks">
          <BookmarksTab
            bookmarks={bookmarks}
            loading={loadingBookmarks}
            onContinue={handleView}
            onLoadMore={loadMoreBookmarks}
            hasMore={hasMoreBookmarks}
            loadingMore={loadingMoreBookmarks}
          />
        </TabsContent>

        <TabsContent value="recent">
          <RecentTab
            items={recentViews}
            loading={loadingRecent}
            onView={handleView}
            onLoadMore={loadMoreRecent}
            hasMore={hasMoreRecent}
            loadingMore={loadingMoreRecent}
          />
        </TabsContent>

        <TabsContent value="all">
          <AllResourcesTab
            resources={allResources}
            loading={loadingAll}
            onBookmark={handleBookmark}
            onView={handleView}
            onFilter={fetchAllResources}
            onLoadMore={loadMoreAll}
            hasMore={hasMoreAll}
            loadingMore={loadingMoreAll}
          />
        </TabsContent>
      </Tabs>

      {trendingResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            🔥 {t('dashboard.trending')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBookmark={handleBookmark}
                onView={handleView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
