'use client';

import { Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelperDetails } from '@/types/helpers';

interface HelperProfileSidebarProps {
  helper: HelperDetails;
}

export function HelperProfileSidebar({
  helper,
}: Readonly<HelperProfileSidebarProps>) {
  const t = useTranslations('helpers.discovery.profile');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center pb-2">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src={helper.user.image} alt={helper.user.name} />
            <AvatarFallback className="text-4xl">
              {helper.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{helper.user.name}</CardTitle>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 font-medium text-foreground">
                {helper?.rating?.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>{t('reviewCount', { count: helper.reviewCount })}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="font-semibold text-lg">
                {helper.completedSessions}
              </div>
              <div className="text-muted-foreground">{t('stats.sessions')}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="font-semibold text-lg">
                {new Date(helper.createdAt).toLocaleDateString(locale, {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="text-muted-foreground">{t('stats.joined')}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">{t('specializations')}</h4>
            <div className="flex flex-wrap gap-2">
              {helper.specializations.map((spec) => (
                <Badge key={spec} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t('languages')}</h4>
            <div className="flex flex-wrap gap-2">
              {helper.languages.map((lang) => (
                <Badge key={lang} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('about')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {helper.bio}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
