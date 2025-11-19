'use client';

import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  UserPlus,
} from 'lucide-react';
import { useRouter, notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getMockEventById } from '@/lib/mock-data/community-events';
import { CommunityEvent } from '@/types/community';

interface EventDetailPageProps {
  params: {
    eventId: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const t = useTranslations('community');
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await getMockEventById(params.eventId);
        if (!eventData) {
          notFound();
        }
        setEvent(eventData);
      } catch {
        toast({
          title: t('events.messages.loadError'),
          description: t('events.errorLoadingEventsDescription'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [params.eventId, t, toast]);

  const handleRegister = async () => {
    if (!event) return;

    setIsRegistering(true);
    try {
      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t('events.messages.registrationSuccess'),
        description: t('events.messages.registrationSuccessDescription'),
      });
    } catch {
      toast({
        title: t('events.messages.registrationError'),
        description: t('events.messages.registrationErrorDescription'),
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    if (globalThis.navigator?.share) {
      try {
        await globalThis.navigator.share({
          title: event?.title,
          text: event?.description,
          url: globalThis.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(globalThis.location.href);
      toast({
        title: t('events.messages.linkCopied'),
        description: t('events.messages.linkCopiedDescription'),
      });
    }
  };

  const handleBackToEvents = () => {
    router.push('/community/events');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBackToEvents} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('events.backToEvents')}
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={event.status === 'upcoming' ? 'default' : 'secondary'}
              >
                {t(`events.status.${event.status}`)}
              </Badge>
              <Badge variant="outline">{t(`events.type.${event.type}`)}</Badge>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {event.title}
            </h1>
            <p className="text-lg text-muted-foreground">{event.description}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Event Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('events.details')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('events.date')}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('events.time')}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleTimeString()} -{' '}
                    {new Date(event.endDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('events.location')}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('events.capacity')}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.currentAttendees || 0} /{' '}
                    {event.maxAttendees || t('events.unlimited')}{' '}
                    {t('events.registered')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('events.about')}</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('events.register')}
            </h3>

            {event.status === 'upcoming' &&
            event.currentAttendees < (event.maxAttendees || Infinity) ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('events.registrationDescription')}
                </p>

                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    t('events.registering')
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t('events.registerNow')}
                    </>
                  )}
                </Button>
              </div>
            ) : event.status === 'upcoming' &&
              event.currentAttendees >= (event.maxAttendees || Infinity) ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('events.eventFull')}
                </p>
                <Badge variant="secondary" className="w-full">
                  {t('events.full')}
                </Badge>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('events.registrationClosed')}
                </p>
              </div>
            )}
          </Card>

          {event.organizer && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t('events.organizer')}
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.organizer.role}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
