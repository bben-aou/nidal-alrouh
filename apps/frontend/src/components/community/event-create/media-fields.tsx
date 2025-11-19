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
import { cn } from '@/lib/utils';
import { EventFormData } from '@/lib/validations/event';

export function MediaFields() {
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
        name="meetingUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              {t('form.meetingUrlLabel')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.meetingUrlPlaceholder')}
                className={cn(
                  'rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0',
                  errors.meetingUrl &&
                    'border-destructive focus:border-destructive'
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
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              {t('form.coverImageLabel')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.coverImagePlaceholder')}
                className={cn(
                  'rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0',
                  errors.coverImage &&
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
