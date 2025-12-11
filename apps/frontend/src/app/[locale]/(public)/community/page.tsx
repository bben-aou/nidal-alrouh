'use client';

import { CommunityEvents } from '@/components/community/public-page/CommunityEvents';
import { CommunityGuidelines } from '@/components/community/public-page/CommunityGuidelines';
import { CommunityHero } from '@/components/community/public-page/CommunityHero';
import { CommunityStats } from '@/components/community/public-page/CommunityStats';
import { RecentDiscussions } from '@/components/community/public-page/RecentDiscussions';

export default function CommunityPage() {
  return (
    <div className="space-y-12">
      <CommunityHero />
      <CommunityStats />
      <CommunityEvents />
      <RecentDiscussions />
      <CommunityGuidelines />
    </div>
  );
}
