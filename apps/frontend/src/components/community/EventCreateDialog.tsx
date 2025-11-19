import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { CreateEventData } from '@/types/community';
import { combineDateAndTime, getTimezone } from '@/utils/event-time';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const localizedSchema = createEventSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(localizedSchema),
    defaultValues: defaultEventFormValues,
  });

  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      const startDateTime = combineDateAndTime(
        values.startDate,
        values.startTime
      );
      const endDateTime = combineDateAndTime(values.endDate, values.endTime);
      const userTimezone = getTimezone();

      const eventData: CreateEventData = {
        title: values.title,
        description: values.description,
        type: values.type,
        status: values.status,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime: values.startTime,
        endTime: values.endTime,
        timezone: userTimezone,
        location: values.location,
        meetingUrl: values.meetingUrl || undefined,
        maxAttendees: values.maxAttendees,
        requiresApproval: values.requiresApproval,
        coverImage: values.coverImage || undefined,
        tags: values.tags,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onEventCreated?.(eventData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('creating') : t('createEvent')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
