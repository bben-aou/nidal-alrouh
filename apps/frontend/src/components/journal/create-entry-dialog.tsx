'use client';

import { Plus, Lock, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { getMoodOptions } from '@/lib/mock-data/journal';

export function CreateEntryDialog() {
  const t = useTranslations('journal');
  const [newEntry, setNewEntry] = useState('');
  const moodOptions = getMoodOptions(t);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.newEntry')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('dashboard.createNewEntry')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.createEntryDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder={t('dashboard.entryTitle')} />
          <div className="grid grid-cols-2 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('dashboard.selectMood')} />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <div className="flex items-center gap-2">
                      <span>{mood.icon}</span>
                      <span>{mood.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
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
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <Input placeholder={t('dashboard.addTags')} />
          <div className="flex justify-end gap-2">
            <Button variant="outline">{t('dashboard.saveDraft')}</Button>
            <Button>{t('dashboard.publish')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
