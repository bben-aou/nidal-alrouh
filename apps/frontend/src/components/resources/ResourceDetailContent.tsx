'use client';

import { ExternalLink, Info, ArrowUpRight } from 'lucide-react';

import { ArticleViewer } from '@/components/resources/ArticleViewer';
import { VideoPlayer } from '@/components/resources/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getResourceThumbnail } from '@/lib/utils/resource-helpers';
import type { Resource } from '@/types/resource';

interface ResourceDetailContentProps {
  resource: Resource;
  t: (key: string) => string;
}

export function ResourceDetailContent({
  resource,
  t,
}: Readonly<ResourceDetailContentProps>) {
  const thumbnail = getResourceThumbnail(resource);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {resource.type === 'VIDEO' && resource.url && (
        <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />
          <div className="relative aspect-video w-full">
            <VideoPlayer url={resource.url} />
          </div>
        </div>
      )}

      {resource.type === 'LINK' && resource.url && (
        <Card className="group relative overflow-hidden border-none bg-black shadow-2xl transition-all hover:shadow-3xl hover:-translate-y-1 duration-500">
          <div className="absolute inset-0 opacity-60 transition-transform duration-700 group-hover:scale-105">
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>

          <CardContent className="relative flex flex-col items-center justify-center p-12 sm:p-16 text-center space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative rounded-full bg-background/10 backdrop-blur-md p-6 ring-1 ring-white/20 shadow-xl">
                <ExternalLink className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {t('detail.externalResource.title')}
              </h3>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                {t('detail.externalResource.description')}
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white text-black hover:bg-white/90"
            >
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {t('detail.externalResource.visitWebsite')}
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {resource.type === 'ARTICLE' && resource.content && (
        <Card className="overflow-hidden border-none shadow-xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50">
          <CardContent className="p-8 sm:p-12">
            <div className="max-w-3xl mx-auto">
              <ArticleViewer content={resource.content} />
            </div>
          </CardContent>
        </Card>
      )}

      {resource.type !== 'ARTICLE' && (
        <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
              <div className="flex-none">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <Info className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  {t('detail.aboutResource')}
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
