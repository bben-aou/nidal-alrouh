'use client';

import { useTranslations } from 'next-intl';

import { CommunityHighlights } from '@/components/dashboard/CommunityHighlights';
import { MoodTrackerPreview } from '@/components/dashboard/MoodTrackerPreview';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';
import { SuggestedResources } from '@/components/dashboard/SuggestedResources';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <WelcomeCard />

      {/* Quick Actions */}
      <QuickActionsGrid />

      {/* Mood Tracker Preview */}
      <MoodTrackerPreview />

      {/* Community Highlights */}
      <CommunityHighlights />

      {/* Suggested Resources */}
      <SuggestedResources />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        {t('footer')}
      </div>
    </div>
  );
}
