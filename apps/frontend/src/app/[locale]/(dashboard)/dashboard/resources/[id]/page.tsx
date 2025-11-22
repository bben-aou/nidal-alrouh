'use client';

import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { VideoPlayer } from '@/components/resources/VideoPlayer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockRecommendedResources } from '@/lib/mock-data/resources';

export default function ResourceViewerPage() {
  const params = useParams();
  const t = useTranslations('resources');
  const id = Number(params.id);

  const resource = mockRecommendedResources.find((r) => r.id === id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/resources">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold truncate">{resource.title}</h1>
      </div>

      {resource.type === 'video' && resource.url && (
        <VideoPlayer url={resource.url} />
      )}

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {resource.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {resource.author}
              </div>
            )}
            {resource.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {resource.readTime}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {t('dashboard.addedOn')} Today
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {resource.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {resource.type === 'article' && resource.content && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          )}

          {resource.type === 'link' && resource.url && (
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="mb-2 font-medium">External Link</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {resource.url}
              </a>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              {t('common.share')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
