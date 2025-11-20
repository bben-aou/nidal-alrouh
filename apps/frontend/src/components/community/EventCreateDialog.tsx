import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateEvent } from '@/apis/events';
import { AdvancedSettings } from '@/components/community/event-create/advanced-settings';
import { DetailsFields } from '@/components/community/event-create/details-fields';
import { LocationFields } from '@/components/community/event-create/location-fields';
import { MediaFields } from '@/components/community/event-create/media-fields';
import { ScheduleFields } from '@/components/community/event-create/schedule-fields';
import { TagsField } from '@/components/community/event-create/tags-field';
import { TypeStatusFields } from '@/components/community/event-create/type-status-fields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { defaultEventFormValues } from '@/lib/defaults/event';
import { createEventSchema } from '@/lib/validations/event';
import { CreateEventData, EventType, EventStatus } from '@/types/community';
import { combineDateAndTime, getTimezone } from '@/utils/event-time';

import type { FieldPath } from 'react-hook-form';

type FormData = import('@/lib/validations/event').EventFormData;

interface EventCreateDialogProps {
  readonly onEventCreated?: (event: CreateEventData) => void;
  readonly trigger?: React.ReactNode;
}

export function EventCreateDialog({
  onEventCreated,
  trigger,
}: EventCreateDialogProps) {
  const t = useTranslations('community.events');
  const [open, setOpen] = useState(false);

  const { createEvent, isPending } = useCreateEvent({
    config: {
      onSuccess: (response) => {
        const eventData: CreateEventData = {
          ...response,
          type: response.type as EventType,
          status: response.status as EventStatus,
        };
        onEventCreated?.(eventData);
        setOpen(false);
        form.reset();
      },
    },
  });

  const localizedSchema = createEventSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(localizedSchema),
    defaultValues: defaultEventFormValues,
  });

  const handleSubmit = (values: FormData) => {
    try {
      const startDateTime = combineDateAndTime(
        values.startDate,
        values.startTime
      );
      const endDateTime = combineDateAndTime(values.endDate, values.endTime);
      const userTimezone = getTimezone();

      const normalizedTags = values.tags
        ? [
            ...new Set(
              values.tags
                .map((tag) => tag.trim().toLowerCase())
                .filter((tag) => tag.length > 0)
            ),
          ]
        : [];

      const normalizeUrl = (u?: string) => {
        if (!u) return undefined;
        const s = u.trim().replace(/^['"`]\s*|\s*['"`]$/g, '');
        return s.length ? s : undefined;
      };

      const eventData = {
        title: values.title.trim(),
        description: values.description.trim(),
        type: values.type,
        status: values.status,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime: values.startTime,
        endTime: values.endTime,
        timezone: userTimezone,
        location: values.location?.trim() || undefined,
        meetingUrl: normalizeUrl(values.meetingUrl),
        maxAttendees: values.maxAttendees,
        requiresApproval: values.requiresApproval,
        coverImage: normalizeUrl(values.coverImage),
        tags: normalizedTags,
      };

      createEvent(eventData);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleInvalid = () => {
    const firstErrorKey = Object.keys(form.formState.errors)[0] as
      | keyof FormData
      | undefined;
    if (firstErrorKey) {
      form.setFocus(firstErrorKey as FieldPath<FormData>);
    }
    toast.error(
      t('validation.fixErrors') || 'Please fix the highlighted errors'
    );
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      {t('createEvent')}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-[92vw] sm:w-full sm:min-w-[640px] sm:max-w-2xl max-h-[90vh] rounded-xl">
        <DialogHeader>
          <DialogTitle>{t('createEvent')}</DialogTitle>
          <DialogDescription>{t('createEventDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
            className="space-y-6 px-1 "
          >
            <div className="flex flex-col  gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-soft">
              <DetailsFields />
              <TypeStatusFields />
              <ScheduleFields />
              <LocationFields />
              <MediaFields />
              <TagsField />
              <AdvancedSettings />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('creating') : t('createEvent')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
