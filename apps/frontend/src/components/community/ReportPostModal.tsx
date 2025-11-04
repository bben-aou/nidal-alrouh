'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useReportPost } from '@/apis/community/queries/use-report-post';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  createCommunitySchemas,
  CreateReportFormData,
} from '@/lib/validations/community';

interface ReportPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string | number;
}

export function ReportPostModal({
  open,
  onOpenChange,
  postId,
}: Readonly<ReportPostModalProps>) {
  const t = useTranslations('community');
  const { createReportSchema } = createCommunitySchemas((key) => t(key));

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReportFormData>({
    resolver: zodResolver(createReportSchema),
    defaultValues: { reason: 'spam' },
  });

  const selectedReason = watch('reason');

  const { mutate, isPending } = useReportPost({
    config: {
      onSuccess: (resp) => {
        toast.success(resp.message || '');
        onOpenChange(false);
        reset({ reason: 'spam' });
      },
    },
  });

  useEffect(() => {
    if (!open) {
      reset({ reason: 'spam' });
    }
  }, [open, reset]);

  const onSubmit = (data: CreateReportFormData) => {
    mutate({ postId, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('dashboard.reportModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('dashboard.reportModal.reason')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                htmlFor="reason-spam"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted focus-within:ring-2 focus-within:ring-ring has-[.peer[data-state=checked]]:border-primary has-[.peer[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id="reason-spam"
                  checked={selectedReason === 'spam'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('reason', 'spam', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  aria-label={t('dashboard.reportModal.reasons.spam')}
                />
                <span className="text-sm">
                  {t('dashboard.reportModal.reasons.spam')}
                </span>
              </label>
              <label
                htmlFor="reason-harassment"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted focus-within:ring-2 focus-within:ring-ring has-[.peer[data-state=checked]]:border-primary has-[.peer[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id="reason-harassment"
                  checked={selectedReason === 'harassment'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('reason', 'harassment', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  aria-label={t('dashboard.reportModal.reasons.harassment')}
                />
                <span className="text-sm">
                  {t('dashboard.reportModal.reasons.harassment')}
                </span>
              </label>
              <label
                htmlFor="reason-misinformation"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted focus-within:ring-2 focus-within:ring-ring has-[.peer[data-state=checked]]:border-primary has-[.peer[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id="reason-misinformation"
                  checked={selectedReason === 'misinformation'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('reason', 'misinformation', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  aria-label={t('dashboard.reportModal.reasons.misinformation')}
                />
                <span className="text-sm">
                  {t('dashboard.reportModal.reasons.misinformation')}
                </span>
              </label>
              <label
                htmlFor="reason-inappropriate"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted focus-within:ring-2 focus-within:ring-ring has-[.peer[data-state=checked]]:border-primary has-[.peer[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id="reason-inappropriate"
                  checked={selectedReason === 'inappropriate'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('reason', 'inappropriate', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  aria-label={t('dashboard.reportModal.reasons.inappropriate')}
                />
                <span className="text-sm">
                  {t('dashboard.reportModal.reasons.inappropriate')}
                </span>
              </label>
              <label
                htmlFor="reason-other"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted focus-within:ring-2 focus-within:ring-ring has-[.peer[data-state=checked]]:border-primary has-[.peer[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id="reason-other"
                  checked={selectedReason === 'other'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('reason', 'other', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  aria-label={t('dashboard.reportModal.reasons.other')}
                />
                <span className="text-sm">
                  {t('dashboard.reportModal.reasons.other')}
                </span>
              </label>
            </div>
            {errors.reason && (
              <p className="text-sm text-destructive" role="alert">
                {errors.reason.message as string}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('dashboard.reportModal.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || isPending}>
              {t('dashboard.reportModal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
