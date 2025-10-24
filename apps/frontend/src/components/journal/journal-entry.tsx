'use client';

import {
  Calendar,
  Clock,
  Tag,
  Eye,
  Edit3,
  Trash2,
  Lock,
  Globe,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  JournalEntry as JournalEntryType,
  getMoodOptions,
} from '@/lib/mock-data/journal';

interface JournalEntryProps {
  entry: JournalEntryType;
}

export function JournalEntry({ entry }: Readonly<JournalEntryProps>) {
  const t = useTranslations('journal');
  const moodOptions = getMoodOptions(t);

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find((m) => m.value === mood);
    return moodOption ? moodOption.icon : '😐';
  };

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find((m) => m.value === mood);
    return moodOption ? moodOption.color : 'text-gray-600';
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{entry.title}</CardTitle>
              {entry.isPrivate ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-lg">{getMoodIcon(entry.mood)}</span>
                <span className={getMoodColor(entry.mood)}>
                  {moodOptions.find((m) => m.value === entry.mood)?.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{entry.time}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">{entry.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="mr-1 h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {entry.wordCount} {t('dashboard.words')}
            </span>
            <span>{entry.readTime}</span>
            <Button variant="ghost" size="sm">
              <Eye className="mr-1 h-3 w-3" />
              {t('dashboard.read')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
