'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { enUS, fr, arSA } from 'react-day-picker/locale';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const locale = useLocale();
  const rdpLocale = locale === 'ar' ? arSA : locale === 'fr' ? fr : enUS;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="after"
      className={cn('p-3', className)}
      locale={rdpLocale}
      dir={dir}
      classNames={{
        ...defaultClassNames,
        root: cn(defaultClassNames.root, 'rounded-xl'),
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'space-y-4',
        nav: 'flex items-center justify-between',
        caption: 'flex items-center justify-center pt-1',
        caption_label: 'text-sm font-medium',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        weekday: 'text-muted-foreground text-[0.8rem]',
        day: 'h-9 w-9 p-0 text-sm',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-foreground hover:ring-2 hover:ring-primary'
        ),
        selected:
          'bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today:
          'ring-2 ring-primary bg-primary/10 text-foreground font-medium hover:bg-primary/20 hover:ring-primary',
        outside:
          'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        range_end: 'range-end',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
