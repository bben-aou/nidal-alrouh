import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { EventFormData } from '@/lib/validations/event';

export function DetailsFields() {
  const t = useTranslations('community.events');
  const form = useFormContext<EventFormData>();
  const {
    formState: { errors },
    control,
  } = form;

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">{t('eventTitle')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('eventTitlePlaceholder')}
                className={cn(
                  'rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0',
                  errors.title && 'border-destructive focus:border-destructive'
                )}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              {t('eventDescription')}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('eventDescriptionPlaceholder')}
                className={cn(
                  'min-h-[120px] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0',
                  errors.description &&
                    'border-destructive focus:border-destructive'
                )}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
