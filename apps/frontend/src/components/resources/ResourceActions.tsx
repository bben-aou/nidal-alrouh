'use client';

import { Clock, Play, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { calculateReadTime } from '@/lib/utils/resource-helpers';
import type { Resource } from '@/types/resource';

interface ResourceActionsProps {
  resource: Resource;
}

export function ResourceActions({ resource }: Readonly<ResourceActionsProps>) {
  const t = useTranslations('resources');

  const actionConfig = {
    VIDEO: {
      icon: Play,
      label: t('dashboard.watch'),
    },
    LINK: {
      icon: ExternalLink,
      label: t('dashboard.visit'),
    },
    ARTICLE: {
      icon: Eye,
      label: t('dashboard.view'),
    },
  };

  const config = actionConfig[resource.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{calculateReadTime(resource)}</span>
      </div>
      <Link href={`/dashboard/resources/${resource.id}`}>
        <Button size="sm" className="group-hover:shadow-md transition-shadow">
          <Icon className="mr-2 h-3 w-3" />
          {config.label}
        </Button>
      </Link>
    </div>
  );
}
