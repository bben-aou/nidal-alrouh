'use client';

import { ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { VideoPlayer } from '@/components/resources/VideoPlayer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRecommendedResources } from '@/lib/mock-data/resources';

export default function ResourceViewerPage() {
  const params = useParams();
  const t = useTranslations('resources');
  // Find the resource by ID
  const resource = mockRecommendedResources.find((r) => r.id === params.id);

  if (!resource) {
    return <div>{t('viewer.notFound')}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard/resources"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('viewer.backToResources')}
        </Link>
      </div>

      <div className="grid gap-6">
        {resource.type === 'VIDEO' && resource.url && (
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black shadow-sm">
            <VideoPlayer url={resource.url} />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {resource.type.toLowerCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {resource.readTime}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {resource.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-semibold text-primary">
                  {resource.author[0]}
                </span>
              </div>
              <span>{resource.author}</span>
            </div>
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-stone dark:prose-invert max-w-none">
          {resource.type === 'ARTICLE' && resource.content ? (
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          ) : (
            <p className="text-lg text-muted-foreground">
              {resource.description}
            </p>
          )}

          {resource.type === 'LINK' && resource.url && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {t('viewer.externalResource')}
                  </span>
                  <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {resource.url}
                  </span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewer.openLink')}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
