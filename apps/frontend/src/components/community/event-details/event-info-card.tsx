import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Users,
  Play,
  Square,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CommunityEvent } from '@/types/community';
import { formatTime } from '@/utils/date';

interface EventInfoCardProps {
  event: CommunityEvent;
  t: (key: string) => string;
  formatDate: (date: string | Date) => string;
  capacityPercentage: number;
  isFull: boolean;
}

export function EventInfoCard({
  event,
  t,
  formatDate,
  capacityPercentage,
  isFull,
}: Readonly<EventInfoCardProps>) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {t('events.details.eventInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-1">
              {t('events.details.date')}
            </p>
            <p className="text-sm text-muted-foreground leading-snug">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </p>
          </div>
        </div>

        <div className="flex gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-2">
              {t('events.details.time')}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span className="font-medium">
                  {formatTime(event.startTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Square className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                <span className="font-medium">{formatTime(event.endTime)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium bg-muted/50 inline-block px-2 py-0.5 rounded">
              {event.timezone}
            </p>
          </div>
        </div>

        {event.location === 'ONLINE' && event.meetingUrl ? (
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />

            <div className="relative space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {t('events.details.virtualEvent')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to join the session
                  </p>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group relative overflow-hidden"
                onClick={() => window.open(event.meetingUrl, '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <Globe className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative">
                  {t('events.details.actions.joinMeeting')}
                </span>
              </Button>
            </div>
          </div>
        ) : event.location ? (
          <div className="flex gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">
                {t('events.details.location')}
              </p>
              <p className="text-sm text-muted-foreground leading-snug">
                {event.location}
              </p>
            </div>
          </div>
        ) : event.meetingUrl ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-2">
                  {t('events.details.virtualEvent')}
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full font-medium"
                  onClick={() => window.open(event.meetingUrl, '_blank')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {t('events.details.actions.joinMeeting')}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {event.maxAttendees && event.maxAttendees > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {t('events.details.capacity')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`font-semibold ${
                      capacityPercentage >= 90
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : capacityPercentage >= 70
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {Math.round(capacityPercentage)}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg className="h-24 w-24 -rotate-90 transform">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - capacityPercentage / 100)}`}
                      className={`transition-all duration-500 ${
                        capacityPercentage >= 90
                          ? 'text-red-500'
                          : capacityPercentage >= 70
                            ? 'text-amber-500'
                            : 'text-green-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">
                      {event.currentAttendees}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      of {event.maxAttendees}
                    </span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-2.5">
                  <div className="rounded-lg bg-muted/30 px-3 py-2.5 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t('events.registered')}
                      </span>
                      <span className="text-sm font-bold">
                        {event.currentAttendees}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-3 py-2.5 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t('events.details.available')}
                      </span>
                      <span className="text-sm font-bold">
                        {event.maxAttendees - event.currentAttendees}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isFull ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {t('events.details.full')}
                  </p>
                </div>
              ) : (
                capacityPercentage >= 70 && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Limited spots remaining
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
