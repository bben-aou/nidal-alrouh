'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Plus, Lock, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useCreateReflection } from '@/apis/journal/queries';
import { GET_JOURNAL_STATS_KEY } from '@/apis/journal/queries/use-get-journal-stats';
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
import { applyInitialFormValues } from '@/lib/utils/form';
import { getMoodOptions, getMoodIcon } from '@/lib/utils/journal';
import { CreateReflectionDialogProps } from '@/types/dialog';
import { PrivacyOption } from '@/types/journal';

export function CreateReflectionDialog({
  open: controlledOpen,
  onOpenChange,
  initialTitle,
  initialContent,
  initialMood,
  initialTags,
  initialPrivacy,
  hideTrigger,
  triggerText,
}: Readonly<CreateReflectionDialogProps> = {}) {
  const t = useTranslations('journal');

  // Controlled/uncontrolled open state handling
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof controlledOpen === 'boolean';
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

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
  const queryClient = useQueryClient();
  const moodOptions = getMoodOptions(t);

  // Prefill form when dialog opens with provided initial values
  useEffect(() => {
    if (!open) return;
    applyInitialFormValues({
      initialTitle,
      initialContent,
      initialMood,
      initialTags,
      initialPrivacy,
      updateField,
      setPrivacy,
    });
  }, [
    open,
    initialTitle,
    initialContent,
    initialMood,
    initialTags,
    initialPrivacy,
  ]);

  const { createReflection, isPending, invalidateReflections } =
    useCreateReflection({
      config: {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(data.message || 'Reflection created successfully');
          } else {
            toast.error(data.message || 'Failed to create reflection');
          }
          invalidateReflections();
          queryClient.invalidateQueries({ queryKey: [GET_JOURNAL_STATS_KEY] });

          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Error creating reflection');
          console.error('Error creating reflection:', error);
        },
      },
    });

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }

    if (tagInput.trim()) {
      handleTagAdd(tagInput.trim());
      setTagInput('');
    }

    const submissionData = getSubmissionData();
    createReflection(submissionData);
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value as PrivacyOption);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            {triggerText || t('dashboard.newReflection')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('dashboard.createNewReflection')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.createReflectionDescription')}
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
              {isPending ? t('dashboard.publishing') : t('dashboard.publish')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
