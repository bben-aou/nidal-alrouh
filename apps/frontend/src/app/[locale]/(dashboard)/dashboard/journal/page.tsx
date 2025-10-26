'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

import { useGetReflections } from '@/apis/journal/queries';
import { JournalAnalyticsTab } from '@/components/journal/journal-analytics-tab';
import { JournalHeader } from '@/components/journal/journal-header';
import { JournalReflectionsList } from '@/components/journal/journal-reflections-list';
import { JournalSearchAndFilter } from '@/components/journal/journal-search-filter';
import { JournalStats } from '@/components/journal/journal-stats';
import { WritingPrompts } from '@/components/journal/writing-prompts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';
import { JournalReflection as JournalReflectionType } from '@/lib/mock-data/journal';
import { transformReflectionData } from '@/lib/utils/journal';

export default function DashboardJournalPage() {
  const t = useTranslations('journal');
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: reflectionsData,
    isLoading,
    isError,
  } = useGetReflections({
    params: {
      q: debouncedSearchTerm || undefined,
      page: 1,
      limit: 10,
    },
  });

  // Transform API response to match JournalReflection interface
  const reflections: JournalReflectionType[] = transformReflectionData(
    reflectionsData || [],
    locale
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <JournalHeader />

      {/* Stats */}
      <JournalStats />

      {/* Search and Filter */}
      <JournalSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Tabs defaultValue="reflections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reflections">
            {t('dashboard.tabs.reflections')}
          </TabsTrigger>
          <TabsTrigger value="prompts">
            {t('dashboard.tabs.prompts')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {t('dashboard.tabs.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reflections" className="space-y-4">
          <JournalReflectionsList
            reflections={reflections}
            isLoading={isLoading}
            isError={isError}
          />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <WritingPrompts />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <JournalAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
