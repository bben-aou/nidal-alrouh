'use client';

import { HeartHandshake, Heart, Shield } from 'lucide-react';
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

export const DesktopCrisisButton = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('crisis');
  const locale = useLocale();
  const isRTL = locale === 'ar';

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
    <div className="hidden md:block">
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed z-50 flex items-center justify-center',
          'bg-gradient-to-br from-primary to-secondary text-primary-foreground',
          'rounded-2xl font-semibold shadow-lg backdrop-blur-sm',
          'transition-all duration-300 ease-out',
          'hover:shadow-xl hover:scale-105 active:scale-95',
          'hover:from-primary/90 hover:to-secondary/90',
          'focus:outline-none focus:ring-4 focus:ring-primary/30',
          'bottom-4 right-4 w-14 h-14',
          // Medium: Slightly larger
          'md:bottom-6 md:right-6 md:w-16 md:h-16',
          // Large: Full button with text
          'lg:bottom-8 lg:right-8 lg:w-auto lg:h-auto lg:px-6 lg:py-3.5',
          // Accessibility - minimum touch target
          'min-w-[56px] min-h-[56px]',
          // Gentle pulsing animation to draw attention
          ' hover:animate-none'
        )}
        aria-label={t('buttonLabel')}
        type="button"
      >
        <HeartHandshake
          className={cn(
            'transition-transform',
            'w-7 h-7',
            'md:w-8 md:h-8',
            'lg:w-5 lg:h-5',
            isRTL ? 'lg:ml-2' : 'lg:mr-2'
          )}
        />
        <span className="hidden lg:inline whitespace-nowrap">
          {t('buttonLabel')}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
            'w-[calc(100vw-2rem)] max-w-md',
            'md:w-[calc(100vw-2rem)] md:max-w-xl',
            'lg:max-w-2xl',
            'max-h-[90vh] overflow-y-auto',
            'rounded-2xl border-0 shadow-2xl',
            'p-6',
            'md:p-8',
            'lg:p-10',
            'bg-background'
          )}
          aria-describedby="crisis-dialog-description-desktop"
        >
          <DialogHeader className="text-center space-y-4 pb-6">
            <DialogTitle
              className={cn(
                'flex items-center justify-start gap-3 font-bold text-primary',
                'text-2xl',
                'md:text-3xl',
                'lg:text-4xl'
              )}
            >
              <div className="p-2.5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full md:p-3 border border-primary/20">
                <Shield className="h-6 w-6 md:h-7 md:w-7 lg:h-6 lg:w-6 text-primary" />
              </div>
              <span>{t('title')}</span>
            </DialogTitle>

            <DialogDescription id="crisis-dialog-description-desktop" asChild>
              <div className="space-y-6">
                <div
                  className={cn(
                    'bg-gradient-to-r from-primary/5 to-secondary/5',
                    'p-4 rounded-xl border border-primary/10',
                    'md:p-5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 md:h-6 md:w-6" />
                    <p
                      className={cn(
                        'text-foreground font-medium leading-relaxed text-left',
                        'text-sm',
                        'md:text-base',
                        'lg:text-lg'
                      )}
                    >
                      {t('intro')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3
                    className={cn(
                      'text-muted-foreground font-semibold uppercase tracking-wider text-left',
                      'text-xs',
                      'md:text-sm'
                    )}
                  >
                    {t('contactsTitle') || 'Emergency Contacts'}
                  </h3>

                  <div className="space-y-3 md:space-y-4">
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
                    'bg-muted/50 p-4 rounded-xl border border-muted',
                    'md:p-5'
                  )}
                >
                  <p
                    className={cn(
                      'text-muted-foreground text-center leading-relaxed',
                      'text-xs',
                      'md:text-sm',
                      'lg:text-base'
                    )}
                  >
                    {t('availability')}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="pt-6 border-t border-border/50">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className={cn(
                'w-full rounded-xl font-medium transition-colors',
                'h-11 text-sm',
                'md:h-12 md:text-base',
                'lg:h-13 lg:text-lg',
                'hover:bg-muted/50'
              )}
              type="button"
            >
              {t('close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
