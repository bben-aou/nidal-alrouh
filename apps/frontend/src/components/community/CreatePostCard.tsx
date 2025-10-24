'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostCardProps {
  className?: string;
  onPostSubmit?: (content: string) => void;
}

export function CreatePostCard({
  className,
  onPostSubmit,
}: Readonly<CreatePostCardProps>) {
  const t = useTranslations('community');
  const [newPost, setNewPost] = useState('');

  const handleSubmit = () => {
    if (newPost.trim()) {
      onPostSubmit?.(newPost);
      setNewPost('');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('dashboard.shareThoughts')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={t('dashboard.postPlaceholder')}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant="secondary">#support</Badge>
            <Badge variant="secondary">#mentalhealth</Badge>
          </div>
          <Button disabled={!newPost.trim()} onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            {t('dashboard.post')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
