'use client';

import { BarChart3, Filter, Search, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CreateEntryDialog } from '@/components/journal/create-entry-dialog';
import { JournalEntry } from '@/components/journal/journal-entry';
import { JournalStats } from '@/components/journal/journal-stats';
import { WritingPrompts } from '@/components/journal/writing-prompts';
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
import { mockJournalEntries } from '@/lib/mock-data/journal';

export default function DashboardJournalPage() {
  const t = useTranslations('journal');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.description')}</p>
        </div>
        <div className="flex gap-2">
          <CreateEntryDialog />
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('dashboard.analytics')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <JournalStats />

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('dashboard.searchEntries')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          {t('dashboard.filter')}
        </Button>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">
            {t('dashboard.tabs.entries')}
          </TabsTrigger>
          <TabsTrigger value="prompts">
            {t('dashboard.tabs.prompts')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {t('dashboard.tabs.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <div className="space-y-4">
            {mockJournalEntries.map((entry) => (
              <JournalEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <WritingPrompts />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.journalAnalytics')}</CardTitle>
              <CardDescription>
                {t('dashboard.analyticsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('dashboard.analyticsComingSoon')}
                </p>
                <Button className="mt-4" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t('dashboard.viewInsights')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
