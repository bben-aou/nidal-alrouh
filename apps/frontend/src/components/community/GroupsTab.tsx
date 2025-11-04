'use client';

import { useTranslations } from 'next-intl';

import { SupportGroupCard } from '@/components/community/SupportGroupCard';
import { mockSupportGroups } from '@/lib/mock-data/community';

interface GroupsTabProps {
  onJoinGroup: (groupName: string) => void;
  onViewGroup: (groupName: string) => void;
}

export function GroupsTab({
  onJoinGroup,
  onViewGroup,
}: Readonly<GroupsTabProps>) {
  useTranslations('community');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockSupportGroups.map((group, index) => (
        <SupportGroupCard
          key={index}
          group={group}
          onJoinGroup={onJoinGroup}
          onViewGroup={onViewGroup}
        />
      ))}
    </div>
  );
}
