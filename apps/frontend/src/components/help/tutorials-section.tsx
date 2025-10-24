'use client';

import {
  Video,
  FileText,
  Clock,
  Star,
  Users,
  ExternalLink,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockTutorials, type Tutorial } from '@/lib/mock-data/help';

interface TutorialsSectionProps {
  tutorials?: Tutorial[];
}

export function TutorialsSection({
  tutorials = mockTutorials,
}: Readonly<TutorialsSectionProps>) {
  const t = useTranslations('help');

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tutorials.map((tutorial) => (
        <Card
          key={tutorial.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{tutorial.thumbnail}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {tutorial.type === 'video' ? (
                      <Video className="mr-1 h-3 w-3" />
                    ) : (
                      <FileText className="mr-1 h-3 w-3" />
                    )}
                    {tutorial.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{tutorial.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{tutorial.views}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    {t('dashboard.view')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
