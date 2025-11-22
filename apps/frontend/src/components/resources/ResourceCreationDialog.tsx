'use client';

import { BookOpen, Link as LinkIcon, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { useTagInput } from '@/hooks/use-tag-input';

interface ResourceCreationDialogProps {
  children: React.ReactNode;
}

export function ResourceCreationDialog({
  children,
}: Readonly<ResourceCreationDialogProps>) {
  const t = useTranslations('resources');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('article');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { tagInput, setTagInput, handleTagAdd, handleTagRemove } = useTagInput(
    () => tags,
    setTags
  );

  const handleSubmit = () => {
    const resourceData = {
      type: activeTab,
      title,
      description,
      tags,
      content: activeTab === 'article' ? content : undefined,
      url: activeTab !== 'article' ? url : undefined,
    };

    console.log('Creating resource:', resourceData);
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setContent('');
    setUrl('');
    setTags([]);
    setTagInput('');
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
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
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  {t('creation.types.link')}
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  {t('creation.types.video')}
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('creation.fields.title')}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('creation.placeholders.title')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t('creation.fields.description')}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('creation.placeholders.description')}
                    rows={3}
                  />
                </div>

                <TabsContent value="article" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>{t('creation.fields.content')}</Label>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder={t('creation.placeholders.content')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="link-url">{t('creation.fields.url')}</Label>
                    <Input
                      id="link-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/resource"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="video-url">
                      {t('creation.fields.videoUrl')}
                    </Label>
                    <Input
                      id="video-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('creation.hints.videoSupport')}
                    </p>
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="tags">{t('creation.fields.tags')}</Label>
                  <TagInput
                    tags={tags}
                    tagInput={tagInput}
                    onTagInputChange={setTagInput}
                    onTagAdd={handleTagAdd}
                    onTagRemove={handleTagRemove}
                    placeholder={t('creation.placeholders.tags')}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleSubmit}>{t('creation.submit')}</Button>
                </div>
              </div>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
