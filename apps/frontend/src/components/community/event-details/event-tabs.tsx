import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityEvent } from '@/types/community';
import { getUserAvatar } from '@/utils/community-events';

interface EventTabsProps {
  event: CommunityEvent;
  t: (key: string, params?: any) => string;
  formatDate: (date: string | Date) => string;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function EventTabs({
  event,
  t,
  formatDate,
  activeTab,
  onTabChange,
}: Readonly<EventTabsProps>) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-auto p-1">
        <TabsTrigger value="overview" className="py-2.5">
          {t('events.details.overview')}
        </TabsTrigger>
        <TabsTrigger value="attendees" className="py-2.5">
          {t('events.details.attendees')} ({event.currentAttendees})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{t('events.about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {event.description}
            </p>
            {event.tags && event.tags.length > 0 && (
              <>
                <Separator className="my-5" />
                <div>
                  <p className="text-sm font-medium mb-2.5">
                    {t('events.details.tags')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="px-3 py-1">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendees" className="mt-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {t('events.details.attendeesList.title', {
                count: event.currentAttendees,
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.attendees && event.attendees.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {event.attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-3 rounded-lg border p-3.5 hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={getUserAvatar(attendee.avatar, attendee.name)}
                      alt={attendee.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-background"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">
                        {attendee.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(attendee.registeredAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <Users className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <p className="font-medium text-muted-foreground">
                  {t('events.details.attendeesList.noAttendees')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('events.details.attendeesList.beFirst')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
