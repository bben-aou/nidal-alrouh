'use client';

import { Plus, Lock, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useUpdateReflection } from '@/apis/journal/queries/use-update-reflection';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { useReflectionForm } from '@/hooks/use-reflection-form';
import type { JournalReflection as JournalReflectionType } from '@/lib/mock-data/journal';
import { getMoodOptions, getMoodIcon } from '@/lib/utils/journal';
import { PrivacyOption } from '@/types/journal';

function mapBackendMoodToFrontend(backendMood: string): string {
  const moodMapping: Record<string, string> = {
    VERY_HAPPY: 'excellent',
    HAPPY: 'good',
    NEUTRAL: 'neutral',
    SAD: 'sad',
    VERY_SAD: 'anxious',
  };
  return moodMapping[backendMood] || 'neutral';
}

export function EditReflectionDialog({
  entry,
}: Readonly<{ entry: JournalReflectionType }>) {
  const t = useTranslations('journal');
  const [open, setOpen] = useState(false);

  const {
    formData,
    tagInput,
    isFormValid,
    updateField,
    setTagInput,
    handleTagAdd,
    handleTagRemove,
    setPrivacy,
    resetForm,
    getSubmissionData,
    privacy,
  } = useReflectionForm();

  const moodOptions = getMoodOptions(t);

  const { updateReflection, isPending, invalidateReflections } =
    useUpdateReflection({
      config: {
        onSuccess: () => {
          toast.success(
            t('dashboard.reflectionUpdated') ||
              'Reflection updated successfully'
          );
          // Explicitly invalidate reflections so the list updates
          invalidateReflections();
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Error updating reflection');
          console.error('Error updating reflection:', error);
        },
      },
    });

  useEffect(() => {
    if (open) {
      // Prefill the form with the current entry values
      updateField('title', entry.title);
      updateField('content', entry.content);
      updateField('mood', mapBackendMoodToFrontend(entry.mood));
      updateField('tags', entry.tags || []);
      setPrivacy(
        entry.isPrivate
          ? ('private' as PrivacyOption)
          : ('public' as PrivacyOption)
      );
    }
  }, [open]);

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value as PrivacyOption);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    if (tagInput.trim()) {
      handleTagAdd(tagInput.trim());
      setTagInput('');
    }

    const submissionData = getSubmissionData();
    updateReflection({ id: String(entry.id), body: submissionData });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className=" h-4 w-4" />
          {t('dashboard.edit')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t('dashboard.editReflection') || 'Edit Reflection'}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.editReflectionDescription') ||
              'Update your reflection details'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t('dashboard.reflectionTitle')}
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.mood}
              onValueChange={(value) => updateField('mood', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.selectMood')} />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((moodOption) => (
                  <SelectItem
                    key={moodOption.value}
                    value={moodOption.value}
                    className="pl-2"
                  >
                    <div className="flex items-center gap-2">
                      {getMoodIcon(moodOption.icon)}
                      <span>{moodOption.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={privacy} onValueChange={handlePrivacyChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.privacy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>{t('dashboard.private')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{t('dashboard.public')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder={t('dashboard.writeYourThoughts')}
            className="min-h-[200px]"
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
          />
          <TagInput
            tags={formData.tags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
            placeholder={t('dashboard.addTags')}
            instructionText={t('dashboard.tagsInstruction')}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t('dashboard.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isPending}>
              {isPending
                ? t('dashboard.saving') || 'Saving...'
                : t('dashboard.save') || 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
