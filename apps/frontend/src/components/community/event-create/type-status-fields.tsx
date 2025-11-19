import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { EventFormData } from '@/lib/validations/event';

export function TypeStatusFields() {
  const t = useTranslations('community.events');
  const form = useFormContext<EventFormData>();
  const {
    formState: { errors },
    control,
  } = form;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">{t('eventType')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn(
                    'rounded-lg focus:ring-0 focus:ring-offset-0',
                    errors.type && 'border-destructive focus:border-destructive'
                  )}
                >
                  <SelectValue placeholder={t('selectEventType')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="workshop">{t('type.workshop')}</SelectItem>
                <SelectItem value="supportSession">
                  {t('type.supportSession')}
                </SelectItem>
                <SelectItem value="consultation">
                  {t('type.consultation')}
                </SelectItem>
                <SelectItem value="communityMeeting">
                  {t('type.communityMeeting')}
                </SelectItem>
                <SelectItem value="webinar">{t('type.webinar')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              {t('eventStatus')}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn(
                    'rounded-lg focus:ring-0 focus:ring-offset-0',
                    errors.status &&
                      'border-destructive focus:border-destructive'
                  )}
                >
                  <SelectValue placeholder={t('selectEventStatus')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="upcoming">{t('status.upcoming')}</SelectItem>
                <SelectItem value="ongoing">{t('status.ongoing')}</SelectItem>
                <SelectItem value="completed">
                  {t('status.completed')}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t('status.cancelled')}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
