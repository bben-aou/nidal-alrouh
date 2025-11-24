'use client';

import { ExternalLink } from 'lucide-react';

import { ArticleViewer } from '@/components/resources/ArticleViewer';
import { VideoPlayer } from '@/components/resources/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Resource } from '@/types/resource';

interface ResourceDetailContentProps {
  resource: Resource;
  t: (key: string) => string;
}

export function ResourceDetailContent({
  resource,
  t,
}: Readonly<ResourceDetailContentProps>) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        {resource.type === 'VIDEO' && resource.url && (
          <div className="mb-8">
            <VideoPlayer url={resource.url} />
          </div>
        )}

        {resource.type === 'ARTICLE' && resource.content && (
          <ArticleViewer content={resource.content} />
        )}

        {resource.type === 'LINK' && resource.url && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-lg border border-dashed">
            <ExternalLink className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {t('detail.externalResource.title')}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {t('detail.externalResource.description')}
              </p>
            </div>
            <Button asChild size="lg">
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {t('detail.externalResource.visitWebsite')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {resource.type !== 'ARTICLE' && (
          <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
            <h3>{t('detail.aboutResource')}</h3>
            <p>{resource.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
