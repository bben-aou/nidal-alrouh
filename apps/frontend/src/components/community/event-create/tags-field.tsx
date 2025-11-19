import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TagInput } from '@/components/ui/tag-input';
import { useTagInput } from '@/hooks/use-tag-input';
import { EventFormData } from '@/lib/validations/event';

export function TagsField() {
  const t = useTranslations('community.events');
  const form = useFormContext<EventFormData>();
  const { control, getValues, setValue } = form;

  const { tagInput, setTagInput, handleTagAdd, handleTagRemove } = useTagInput(
    () => getValues('tags'),
    (tags) => setValue('tags', tags)
  );

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground">
            {t('form.tagsLabel')}
          </FormLabel>
          <FormControl>
            <TagInput
              tags={field.value}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onTagAdd={handleTagAdd}
              onTagRemove={handleTagRemove}
              placeholder={t('form.tagsPlaceholder')}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
