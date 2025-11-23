'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Link as LinkIcon, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { RichTextEditor } from '@/components/resources/RichTextEditor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateResource, ResourceType } from '@/hooks/use-resources';
import { useTagInput } from '@/hooks/use-tag-input';
import { cn } from '@/lib/utils';
import {
  createResourceSchemas,
  type CreateResourceFormData,
} from '@/lib/validations/resources';

interface ResourceCreationDialogProps {
  children: React.ReactNode;
}

export function ResourceCreationDialog({
  children,
}: Readonly<ResourceCreationDialogProps>) {
  const t = useTranslations('resources');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'article' | 'link' | 'video'>(
    'article'
  );

  const { createResourceSchema } = createResourceSchemas(t);

  const form = useForm<CreateResourceFormData>({
    resolver: zodResolver(createResourceSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      type: 'ARTICLE',
      content: '',
      url: '',
      tags: [],
    },
  });

  const tags = form.watch('tags');
  const { tagInput, setTagInput, handleTagAdd, handleTagRemove } = useTagInput(
    () => tags,
    (newTags) => form.setValue('tags', newTags, { shouldValidate: true })
  );

  const { mutate: createResource, isPending } = useCreateResource();

  const handleTabChange = (value: string) => {
    const newTab = value as 'article' | 'link' | 'video';
    setActiveTab(newTab);
    form.setValue('type', newTab.toUpperCase() as ResourceType);
  };

  const onSubmit = (data: CreateResourceFormData) => {
    createResource(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        setTagInput('');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>{t('creation.title')}</DialogTitle>
              <DialogDescription>{t('creation.description')}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="mt-4"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="article"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      {t('creation.types.article')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="link"
                      className="flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {t('creation.types.link')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      {t('creation.types.video')}
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('creation.fields.title')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('creation.placeholders.title')}
                              className={cn(
                                form.formState.errors.title &&
                                  'border-destructive focus-visible:ring-destructive'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('creation.fields.description')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t(
                                'creation.placeholders.description'
                              )}
                              rows={3}
                              className={cn(
                                form.formState.errors.description &&
                                  'border-destructive focus-visible:ring-destructive'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <TabsContent value="article" className="space-y-4 mt-0">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('creation.fields.content')}
                            </FormLabel>
                            <FormControl>
                              <RichTextEditor
                                content={field.value || ''}
                                onChange={field.onChange}
                                placeholder={t('creation.placeholders.content')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4 mt-0">
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('creation.fields.url')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://example.com/resource"
                                className={cn(
                                  form.formState.errors.url &&
                                    'border-destructive focus-visible:ring-destructive'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="video" className="space-y-4 mt-0">
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('creation.fields.videoUrl')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://youtube.com/watch?v=..."
                                className={cn(
                                  form.formState.errors.url &&
                                    'border-destructive focus-visible:ring-destructive'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              {t('creation.hints.videoSupport')}
                            </p>
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={() => (
                        <FormItem>
                          <FormLabel>{t('creation.fields.tags')}</FormLabel>
                          <FormControl>
                            <TagInput
                              tags={tags}
                              tagInput={tagInput}
                              onTagInputChange={setTagInput}
                              onTagAdd={handleTagAdd}
                              onTagRemove={handleTagRemove}
                              placeholder={t('creation.placeholders.tags')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending || !form.formState.isValid}
                      >
                        {isPending ? 'Publishing...' : t('creation.submit')}
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
