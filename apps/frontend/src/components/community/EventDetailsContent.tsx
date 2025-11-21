'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { useDeleteEvent } from '@/apis/events/queries/use-delete-event';
import { useGetEventById } from '@/apis/events/queries/use-get-event-by-id';
import { useRegisterForEvent } from '@/apis/events/queries/use-register-for-event';
import { useUnregisterForEvent } from '@/apis/events/queries/use-unregister-for-event';
import { useUpdateEvent } from '@/apis/events/queries/use-update-event';
import { DeleteEventDialog } from '@/components/community/DeleteEventDialog';
import { EventActions } from '@/components/community/event-details/event-actions';
import { EventHero } from '@/components/community/event-details/event-hero';
import { EventInfoCard } from '@/components/community/event-details/event-info-card';
import { EventOrganizerCard } from '@/components/community/event-details/event-organizer-card';
import { EventTabs } from '@/components/community/event-details/event-tabs';
import { EventFormDialog } from '@/components/community/EventFormDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useEventsRealtime } from '@/hooks/use-events-realtime';
import { CreateEventData } from '@/types/community';
import { canRegister, isFullyBooked } from '@/utils/community-events';
import { getLocalizedDateFormatter } from '@/utils/date';

interface EventDetailsContentProps {
  eventId: string;
}

export function EventDetailsContent({
  eventId,
}: Readonly<EventDetailsContentProps>) {
  const t = useTranslations('community');
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { formatDate } = getLocalizedDateFormatter(t);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { event, isLoading, isError } = useGetEventById({ eventId });

  useEventsRealtime(event ? [event.id] : []);

  const { registerForEvent, isPending: isRegistering } = useRegisterForEvent();
  const { unregisterForEvent, isPending: isUnregistering } =
    useUnregisterForEvent();
  const { updateEvent, isPending: isUpdating } = useUpdateEvent({
    config: {
      onSuccess: () => {
        toast({
          title: t('events.messages.updateSuccess'),
          description: t('events.messages.updateSuccessDescription'),
        });
        setEditDialogOpen(false);
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: t('events.messages.updateError'),
          description: t('events.messages.updateErrorDescription'),
        });
      },
    },
  });
  const { deleteEvent, isPending: isDeleting } = useDeleteEvent({
    config: {
      onSuccess: () => {
        toast({
          title: t('events.messages.deleteSuccess'),
          description: t('events.messages.deleteSuccessDescription'),
        });
        router.push('/dashboard/community');
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: t('events.messages.deleteError'),
          description: t('events.messages.deleteErrorDescription'),
        });
      },
    },
  });

  const isOrganizer = useMemo(
    () => event && user?.id === event.organizer.id,
    [event, user]
  );
  const canRegisterForEvent = useMemo(
    () => event && canRegister(event),
    [event]
  );
  const isFull = useMemo(() => event && isFullyBooked(event), [event]);

  const handleRegister = () => {
    if (!event) return;
    registerForEvent({ eventId: event.id });
  };

  const handleUnregister = () => {
    if (!event) return;
    if (isOrganizer) {
      toast({
        title: t('events.eventOrganizerCannotUnregisterTitle'),
        description: t('events.eventOrganizerCannotUnregisterDescription'),
      });
      return;
    }
    unregisterForEvent({ eventId: event.id });
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleUpdateSubmit = async (data: CreateEventData) => {
    if (!event) return;
    await updateEvent({ eventId: event.id, data });
  };

  const handleConfirmDelete = async () => {
    if (!event) return;
    await deleteEvent({ eventId: event.id });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t('events.messages.linkCopied'),
        description: t('events.messages.linkCopiedDescription'),
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('events.details.backToEvents')}
        </Button>
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Calendar className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">
            {t('events.details.errors.notFound')}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {t('events.details.errors.notFoundDescription')}
          </p>
          <Button onClick={handleBack}>
            {t('events.details.backToEvents')}
          </Button>
        </Card>
      </div>
    );
  }

  const capacityPercentage = event.maxAttendees
    ? (event.currentAttendees / event.maxAttendees) * 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 -ml-4 gap-2 hover:bg-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('events.details.backToEvents')}
      </Button>

      <EventHero event={event} t={t} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Content */}
        <div className="space-y-6">
          <EventTabs
            event={event}
            t={t}
            formatDate={formatDate}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="space-y-5">
          <EventInfoCard
            event={event}
            t={t}
            formatDate={formatDate}
            capacityPercentage={capacityPercentage}
            isFull={isFull ?? false}
          />

          <EventOrganizerCard event={event} t={t} />

          <EventActions
            event={event}
            t={t}
            isOrganizer={isOrganizer ?? false}
            isFull={isFull ?? false}
            canRegisterForEvent={canRegisterForEvent ?? false}
            isRegistering={isRegistering}
            isUnregistering={isUnregistering}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            onShare={handleShare}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {event && editDialogOpen && (
        <EventFormDialog
          mode="edit"
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialValues={{
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            tags: event.tags || [],
            location: event.location || '',
            meetingUrl: event.meetingUrl || '',
            coverImage: event.coverImage || '',
            maxAttendees: event.maxAttendees || 0,
          }}
          onSubmit={handleUpdateSubmit}
          isPending={isUpdating}
        />
      )}

      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}

function EventDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-4 h-10 w-40" />
      <Skeleton className="mb-8 h-64 w-full rounded-lg md:h-96" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
