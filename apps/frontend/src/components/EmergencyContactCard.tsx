'use client';

import { Phone } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmergencyContact {
  label: string;
  number: string;
  variant: 'primary' | 'destructive' | 'accent';
}

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  locale?: string;
}

export const EmergencyContactCard = ({
  contact,
}: EmergencyContactCardProps) => {
  const { label, number, variant } = contact;
  const cleanNumber = number.replace(/\s|-/g, '');

  const variantStyles = {
    primary: {
      container:
        'from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40',
      icon: 'bg-primary/10 group-hover:bg-primary/20',
      iconColor: 'text-primary',
      numberColor: 'text-primary',
    },
    destructive: {
      container:
        'from-destructive/5 to-destructive/10 border-destructive/20 hover:border-destructive/40',
      icon: 'bg-destructive/10 group-hover:bg-destructive/20',
      iconColor: 'text-destructive',
      numberColor: 'text-destructive',
    },
    accent: {
      container:
        'from-accent/20 to-accent/30 border-accent/30 hover:border-accent/50',
      icon: 'bg-accent/20 group-hover:bg-accent/30',
      iconColor: 'text-accent-foreground',
      numberColor: 'text-accent-foreground',
    },
  };

  const styles = variantStyles[variant];

  return (
    <a
      href={`tel:${cleanNumber}`}
      className={cn(
        'group flex items-center gap-3 p-2 rounded-xl border transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        'md:gap-4 md:p-2',
        'bg-gradient-to-r',
        styles.container
      )}
      aria-label={`${label}: ${number}`}
    >
      <div
        className={cn(
          'p-2.5 rounded-full transition-colors flex-shrink-0',
          'md:p-3',
          styles.icon
        )}
      >
        <Phone className={cn('h-5 w-5', styles.iconColor)} />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'font-semibold text-foreground mb-1 text-sm leading-tight',
            'md:text-base'
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'font-bold text-xl leading-tight',
            'md:text-2xl',
            'lg:text-3xl',
            styles.numberColor
          )}
        >
          {number}
        </div>
      </div>
    </a>
  );
};

export type { EmergencyContact, EmergencyContactCardProps };
