'use client';

import {
  Heart,
  Users,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    {
      icon: Heart,
      title: t('values.compassion.title'),
      description: t('values.compassion.description'),
    },
    {
      icon: Users,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      icon: Target,
      title: t('values.accessibility.title'),
      description: t('values.accessibility.description'),
    },
    {
      icon: Award,
      title: t('values.excellence.title'),
      description: t('values.excellence.description'),
    },
  ];

  const achievements = [
    t('achievements.users'),
    t('achievements.sessions'),
    t('achievements.professionals'),
    t('achievements.languages'),
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/contact">
              {t('hero.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/resources">{t('hero.learnMore')}</Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('mission.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('mission.description')}
          </p>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-foreground">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
          <div className="text-4xl font-bold text-primary mb-2">2024</div>
          <p className="text-muted-foreground">{t('mission.founded')}</p>
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('values.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('values.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('team.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              {t('team.joinUs')}
            </h3>
            <p className="text-muted-foreground">{t('team.joinDescription')}</p>
            <Button asChild>
              <Link href="/contact">{t('team.getInvolved')}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
