'use client';

import { Search, Filter, TrendingUp, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BookmarkCard } from '@/components/resources/BookmarkCard';
import { RecentlyViewedCard } from '@/components/resources/RecentlyViewedCard';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceStats } from '@/components/resources/ResourceStats';
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
import {
  mockRecommendedResources,
  mockBookmarks,
  mockRecentlyViewed,
} from '@/lib/mock-data/resources';

export default function DashboardResourcesPage() {
  const t = useTranslations('resources');
  const [searchTerm, setSearchTerm] = useState('');

  const handleBookmark = (resourceId: number) => {
    console.log('Bookmark resource:', resourceId);
  };

  const handleView = (resourceId: number) => {
    console.log('View resource:', resourceId);
  };

  const handleContinue = (bookmarkId: number) => {
    console.log('Continue bookmark:', bookmarkId);
  };

  const handleReview = (bookmarkId: number) => {
    console.log('Review bookmark:', bookmarkId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('dashboard.trending')}
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t('dashboard.filter')}
          </Button>
        </div>
      </div>

      {/* Progress Stats */}
      <ResourceStats />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('dashboard.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="recommended" className="space-y-4">
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

        <TabsContent value="recommended" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t('dashboard.recommendedForYou')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockRecommendedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onBookmark={handleBookmark}
                  onView={handleView}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t('dashboard.myBookmarks')}
            </h2>
            <div className="space-y-3">
              {mockBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onContinue={handleContinue}
                  onReview={handleReview}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t('dashboard.recentlyViewed')}
            </h2>
            <div className="space-y-3">
              {mockRecentlyViewed.map((item) => (
                <RecentlyViewedCard
                  key={item.id}
                  item={item}
                  onView={handleView}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.allResources')}</CardTitle>
              <CardDescription>
                {t('dashboard.allResourcesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('dashboard.browseAllResources')}
                </p>
                <Button className="mt-4">
                  <Search className="mr-2 h-4 w-4" />
                  {t('dashboard.exploreAll')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
