'use client';

import { AlertCircle, Heart } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  EmergencyContactCard,
  type EmergencyContact,
} from './EmergencyContactCard';

export const MobileCrisisButton = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('crisis');
  const locale = useLocale();

  const emergencyContacts: EmergencyContact[] = [
    {
      label: t('lines.nationalHotline.label'),
      number: t('lines.nationalHotline.number'),
      variant: 'primary',
    },
    {
      label: t('lines.medical.label'),
      number: t('lines.medical.number'),
      variant: 'destructive',
    },
    {
      label: t('lines.police.label'),
      number: t('lines.police.number'),
      variant: 'accent',
    },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed z-50 flex items-center justify-center',
          'bg-destructive text-destructive-foreground',
          'rounded-full font-semibold shadow-xl',
          'transition-all duration-300 ease-out',
          'hover:shadow-2xl active:scale-95',
          'focus:outline-none focus:ring-4 focus:ring-destructive/40',
          'bottom-4 right-4 w-16 h-16',
          'min-w-[56px] min-h-[56px]'
        )}
        aria-label={t('buttonLabel')}
        type="button"
      >
        <AlertCircle className="w-7 h-7" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'fixed bottom-0 left-0 right-0 translate-x-0 translate-y-0',
            'w-full max-w-none',
            'max-h-[85vh] overflow-y-auto',
            'rounded-t-2xl border-t shadow-2xl',
            'p-4',
            'bg-background'
          )}
          aria-describedby="crisis-dialog-description-mobile"
        >
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle
              className={cn(
                'flex items-center justify-start gap-3 font-bold text-destructive',
                'text-xl'
              )}
            >
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span>{t('title')}</span>
            </DialogTitle>

            <DialogDescription id="crisis-dialog-description-mobile" asChild>
              <div className="space-y-4">
                <div
                  className={cn(
                    'bg-gradient-to-r from-destructive/5 to-primary/5',
                    'p-3 rounded-md border border-destructive/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p
                      className={cn(
                        'text-foreground font-medium leading-relaxed text-left',
                        'text-sm'
                      )}
                    >
                      {t('intro')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3
                    className={cn(
                      'text-muted-foreground font-semibold uppercase tracking-wider text-left',
                      'text-xs'
                    )}
                  >
                    {t('contactsTitle') || 'Emergency Contacts'}
                  </h3>

                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <EmergencyContactCard
                        key={index}
                        contact={contact}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className={cn(
                    'bg-muted/50 p-4 rounded-xl border border-muted'
                  )}
                >
                  <p
                    className={cn(
                      'text-muted-foreground text-center leading-relaxed',
                      'text-xs'
                    )}
                  >
                    {t('availability')}
                  </p>
                </div>

                <div>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="outline"
                    className={cn(
                      'w-full rounded-xl font-medium transition-colors',
                      'h-11 text-sm',
                      'hover:bg-muted/50'
                    )}
                    type="button"
                  >
                    {t('close')}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
