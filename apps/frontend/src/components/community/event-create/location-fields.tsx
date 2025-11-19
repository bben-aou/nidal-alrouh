import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EventFormData } from '@/lib/validations/event';

export function LocationFields() {
  const t = useTranslations('community.events');
  const form = useFormContext<EventFormData>();
  const {
    formState: { errors },
    control,
  } = form;

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground">{t('location')}</FormLabel>
          <FormControl>
            <Input
              placeholder={t('locationPlaceholder')}
              className={cn(
                'rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0',
                errors.location && 'border-destructive focus:border-destructive'
              )}
              {...field}
            />
          </FormControl>
          <FormDescription>{t('locationDescription')}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
