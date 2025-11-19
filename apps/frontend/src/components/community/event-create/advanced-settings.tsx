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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { EventFormData } from '@/lib/validations/event';

export function AdvancedSettings() {
  const t = useTranslations('community.events');
  const form = useFormContext<EventFormData>();
  const {
    formState: { errors },
    control,
  } = form;

  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="maxAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">
              {t('form.maxAttendeesLabel')}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                className={cn(
                  'rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                  errors.maxAttendees &&
                    'border-destructive focus:border-destructive'
                )}
                min="1"
                max="1000"
                value={field.value as number | ''}
                onChange={(e) => {
                  const { value } = e.target;
                  field.onChange(value === '' ? '' : Number.parseInt(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="requiresApproval"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <FormLabel className="text-foreground">
                {t('form.requiresApprovalLabel')}
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
