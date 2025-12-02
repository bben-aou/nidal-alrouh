'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepProfileInfoProps } from '@/types/helpers';

const AVAILABLE_SPECIALIZATIONS = [
  'Anxiety',
  'Depression',
  'Stress Management',
  'Grief & Loss',
  'Relationship Issues',
  'Self-Esteem',
  'Life Transitions',
  'Trauma',
  'General Support',
];

const AVAILABLE_LANGUAGES = ['English', 'Arabic', 'French', 'Spanish'];

export function StepProfileInfo({ data, onDataChange }: StepProfileInfoProps) {
  const t = useTranslations('helpers.registration.profile');

  const toggleSpecialization = (spec: string) => {
    const newSpecs = data.specializations.includes(spec)
      ? data.specializations.filter((s) => s !== spec)
      : [...data.specializations, spec];
    onDataChange({ specializations: newSpecs });
  };

  const toggleLanguage = (lang: string) => {
    const newLangs = data.languages.includes(lang)
      ? data.languages.filter((l) => l !== lang)
      : [...data.languages, lang];
    onDataChange({ languages: newLangs });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio">
          {t('bio.label')} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="bio"
          placeholder={t('bio.placeholder')}
          value={data.bio}
          onChange={(e) => onDataChange({ bio: e.target.value })}
          className="min-h-[150px]"
        />
        <p className="text-sm text-muted-foreground">
          {data.bio.length} / 500 {t('bio.minimum')}
        </p>
        {data.bio.length < 50 && data.bio.length > 0 && (
          <p className="text-sm text-destructive">{t('bio.minError')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>
          {t('specializations.label')}{' '}
          <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          {t('specializations.description')}
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SPECIALIZATIONS.map((spec) => (
            <Badge
              key={spec}
              variant={
                data.specializations.includes(spec) ? 'default' : 'outline'
              }
              className="cursor-pointer"
              onClick={() => toggleSpecialization(spec)}
            >
              {spec}
              {data.specializations.includes(spec) && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
        {data.specializations.length === 0 && (
          <p className="text-sm text-destructive">
            {t('specializations.error')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>
          {t('languages.label')} <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <Badge
              key={lang}
              variant={data.languages.includes(lang) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleLanguage(lang)}
            >
              {lang}
              {data.languages.includes(lang) && <X className="w-3 h-3 ml-1" />}
            </Badge>
          ))}
        </div>
        {data.languages.length === 0 && (
          <p className="text-sm text-destructive">{t('languages.error')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxSessions">{t('maxSessions.label')}</Label>
        <Input
          id="maxSessions"
          type="number"
          min="1"
          max="20"
          value={data.maxSessionsPerWeek}
          onChange={(e) =>
            onDataChange({ maxSessionsPerWeek: parseInt(e.target.value) || 4 })
          }
        />
        <p className="text-sm text-muted-foreground">
          {t('maxSessions.description')}
        </p>
      </div>
    </div>
  );
}
