'use client';

import {
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  MessageCircle,
  Share2,
  Shield,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelperDetails } from '@/types/helpers';

interface HelperProfileHeaderProps {
  helper: HelperDetails;
  isRTL?: boolean;
  onMessage: () => void;
  onBook: () => void;
  onShare: () => void;
  isCreatingDm?: boolean;
}

export default function HelperProfileHeader({
  helper,
  isRTL,
  onMessage,
  onBook,
  onShare,
  isCreatingDm,
}: Readonly<HelperProfileHeaderProps>) {
  const t = useTranslations('helpers.discovery.profile');
  return (
    <Card className="overflow-hidden  border border-border/50 shadow-sm">
      <CardContent className="p-6 sm:p-8 ">
        <div
          className={`grid grid-cols-1 lg:grid-cols-[140px_1fr_auto] ${isRTL ? 'gap-4 lg:gap-6' : 'gap-6 lg:gap-8'}`}
        >
          <div
            className={`flex ${isRTL ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}
          >
            <Avatar className="w-32 h-32 border-2 border-border shadow-sm">
              <AvatarImage
                src={helper.user.image || '/placeholder.svg'}
                alt={helper.user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground font-semibold">
                {helper.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div
            className={`space-y-3 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
          >
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {helper.user.name}
            </h1>
            <div className="flex flex-wrap  justify-center lg:justify-start gap-2">
              {helper.specializations.slice(0, 4).map((spec) => (
                <Badge
                  key={spec}
                  variant="secondary"
                  className="px-3 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {spec}
                </Badge>
              ))}
              {helper.specializations.length > 4 && (
                <Badge
                  variant="outline"
                  className="px-3 rounded-md py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  +{helper.specializations.length - 4}
                </Badge>
              )}
            </div>
            <div className="grid w-full grid-cols-3 items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-border/30 shrink-0">
                  <Star className="h-4 w-4 text-amber-500" fill="none" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {helper.rating?.toFixed(1) ?? 'N/A'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('reviewCount', { count: helper.reviewCount })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-border/30 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {helper.completedSessions}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('stats.sessions')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-border/30 shrink-0">
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {helper.languages.length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('languages')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 w-full">
            <div className="flex gap-3">
              <Button
                onClick={onMessage}
                disabled={isCreatingDm}
                size="default"
                className="flex-1 h-11"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('message')}
              </Button>
              {helper.calUsername && (
                <Button
                  variant="secondary"
                  onClick={onBook}
                  size="default"
                  className="flex-1 h-11"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('bookSession')}
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={onShare}
                className="shrink-0 bg-transparent h-11 w-11"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg border bg-card/50 p-4">
                <div className="p-2 rounded-full bg-background border shrink-0">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">
                    {t('trust.verifiedTitle')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight truncate">
                    {t('trust.verifiedSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-card/50 p-4">
                <div className="p-2 rounded-full bg-background border shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">
                    {t('trust.fastTitle')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight truncate">
                    {t('trust.fastSubtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
