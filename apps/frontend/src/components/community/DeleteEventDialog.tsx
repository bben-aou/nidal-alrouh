import { useTranslations } from 'next-intl';

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

interface DeleteEventDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => Promise<void>;
  readonly isPending?: boolean;
  readonly trigger?: React.ReactNode;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  trigger,
}: DeleteEventDialogProps) {
  const t = useTranslations('community.events');

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteEvent')}</DialogTitle>
          <DialogDescription>
            {t('deleteEventConfirmation') ||
              'Are you sure you want to delete this event? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? t('deleting') || 'Deleting...' : t('deleteEvent')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
