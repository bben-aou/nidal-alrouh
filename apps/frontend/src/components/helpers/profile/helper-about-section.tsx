'use client';

import { ChevronDown, Globe, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HelperAboutSectionProps {
  bio: string;
  specializations: string[];
  languages: string[];
}

const HelperAboutSection = ({
  bio,
  specializations,
  languages,
}: Readonly<HelperAboutSectionProps>) => {
  const t = useTranslations('helpers.discovery.profile');
  const [showFullBio, setShowFullBio] = useState(false);
  const truncated = bio.slice(0, 300);
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>{t('about')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {showFullBio
                ? bio
                : `${truncated}${bio.length > 300 ? '...' : ''}`}
            </p>
          </div>
          {bio.length > 300 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullBio(!showFullBio)}
              className="mt-2 h-auto px-3 py-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              {showFullBio
                ? t('showLess', { default: 'Show less' })
                : t('readMore', { default: 'Read more' })}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${showFullBio ? 'rotate-180' : ''}`}
              />
            </Button>
          )}
        </div>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
          <div className="flex-1 rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t('specializations')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="bg-background">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {t('languages')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Badge key={lang} variant="outline" className="bg-background">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelperAboutSection;
