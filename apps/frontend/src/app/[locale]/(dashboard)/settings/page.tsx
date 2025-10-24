'use client';

import { Bell, Shield, Palette, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    privacy: {
      profileVisible: true,
      showActivity: false,
      allowMessages: true,
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    },
  });

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('notifications.title')}
            </CardTitle>
            <CardDescription>{t('notifications.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('notifications.email')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.emailDescription')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: checked,
                    },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('notifications.push')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.pushDescription')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('notifications.sms')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.smsDescription')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sms: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('privacy.title')}
            </CardTitle>
            <CardDescription>{t('privacy.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('privacy.profileVisible')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('privacy.profileVisibleDescription')}
                </p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profileVisible: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('privacy.showActivity')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('privacy.showActivityDescription')}
                </p>
              </div>
              <Switch
                checked={settings.privacy.showActivity}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, showActivity: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('privacy.allowMessages')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('privacy.allowMessagesDescription')}
                </p>
              </div>
              <Switch
                checked={settings.privacy.allowMessages}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, allowMessages: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('preferences.title')}
            </CardTitle>
            <CardDescription>{t('preferences.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('preferences.theme')}</Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, theme: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      {t('preferences.themeLight')}
                    </SelectItem>
                    <SelectItem value="dark">
                      {t('preferences.themeDark')}
                    </SelectItem>
                    <SelectItem value="system">
                      {t('preferences.themeSystem')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('preferences.language')}</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('preferences.timezone')}</Label>
              <Select
                value={settings.preferences.timezone}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, timezone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                  <SelectItem value="Africa/Casablanca">Casablanca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="min-w-32">
            <Save className="mr-2 h-4 w-4" />
            {t('actions.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
