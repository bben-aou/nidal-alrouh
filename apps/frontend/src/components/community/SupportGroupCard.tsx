'use client';

import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type SupportGroup } from '@/types/community';

interface SupportGroupCardProps {
  group: SupportGroup;
  className?: string;
  onJoinGroup?: (groupName: string) => void;
  onViewGroup?: (groupName: string) => void;
}

export function SupportGroupCard({
  group,
  className,
  onJoinGroup,
  onViewGroup,
}: Readonly<SupportGroupCardProps>) {
  const t = useTranslations('community');

  const handleButtonClick = () => {
    if (group.isJoined) {
      onViewGroup?.(group.name);
    } else {
      onJoinGroup?.(group.name);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription>
              {group.members} {t('dashboard.members')}
            </CardDescription>
          </div>
          {group.isJoined && (
            <Badge variant="secondary">{t('dashboard.joined')}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{group.description}</p>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{group.nextMeeting}</span>
        </div>
        <Button
          variant={group.isJoined ? 'outline' : 'default'}
          className="w-full"
          onClick={handleButtonClick}
        >
          {group.isJoined ? t('dashboard.viewGroup') : t('dashboard.joinGroup')}
        </Button>
      </CardContent>
    </Card>
  );
}
