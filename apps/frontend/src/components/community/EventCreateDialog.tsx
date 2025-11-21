import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCreateEvent } from '@/apis/events';
import { EventFormDialog } from '@/components/community/EventFormDialog';
import { Button } from '@/components/ui/button';
import { CreateEventData, EventType, EventStatus } from '@/types/community';

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
      },
    },
  });

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      {t('createEvent')}
    </Button>
  );

  return (
    <EventFormDialog
      mode="create"
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || defaultTrigger}
      onSubmit={async (data) => {
        await createEvent(data);
      }}
      isPending={isPending}
    />
  );
}
