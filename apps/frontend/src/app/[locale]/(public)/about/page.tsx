'use client';

import {
  Heart,
  Users,
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Lightbulb,
  Code,
  Calendar,
  MapPin,
  UserCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
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
      icon: Shield,
      title: t('values.privacy.title'),
      description: t('values.privacy.description'),
    },
    {
      icon: Globe,
      title: t('values.accessibility.title'),
      description: t('values.accessibility.description'),
    },
    {
      icon: Lightbulb,
      title: t('values.empowerment.title'),
      description: t('values.empowerment.description'),
    },
  ];

  const achievements = [
    t('achievements.users'),
    t('achievements.sessions'),
    t('achievements.professionals'),
    t('achievements.languages'),
  ];

  const phases = [
    {
      title: t('phases.phase1.title'),
      description: t('phases.phase1.description'),
      timeline: t('phases.phase1.timeline'),
      features: [
        t('phases.phase1.features.0'),
        t('phases.phase1.features.1'),
        t('phases.phase1.features.2'),
        t('phases.phase1.features.3'),
      ],
      status: 'current',
    },
    {
      title: t('phases.phase2.title'),
      description: t('phases.phase2.description'),
      timeline: t('phases.phase2.timeline'),
      features: [
        t('phases.phase2.features.0'),
        t('phases.phase2.features.1'),
        t('phases.phase2.features.2'),
        t('phases.phase2.features.3'),
      ],
      status: 'upcoming',
    },
    {
      title: t('phases.phase3.title'),
      description: t('phases.phase3.description'),
      timeline: t('phases.phase3.timeline'),
      features: [
        t('phases.phase3.features.0'),
        t('phases.phase3.features.1'),
        t('phases.phase3.features.2'),
        t('phases.phase3.features.3'),
      ],
      status: 'future',
    },
  ];

  const targetUsersPrimary = [
    t('targetUsers.primary.items.0'),
    t('targetUsers.primary.items.1'),
    t('targetUsers.primary.items.2'),
    t('targetUsers.primary.items.3'),
  ];

  const targetUsersSecondary = [
    t('targetUsers.secondary.items.0'),
    t('targetUsers.secondary.items.1'),
    t('targetUsers.secondary.items.2'),
    t('targetUsers.secondary.items.3'),
  ];

  const culturalItems = [
    t('cultural.items.0'),
    t('cultural.items.1'),
    t('cultural.items.2'),
    t('cultural.items.3'),
    t('cultural.items.4'),
  ];

  const openSourceApproach = [
    t('openSource.approach.0'),
    t('openSource.approach.1'),
    t('openSource.approach.2'),
    t('openSource.approach.3'),
    t('openSource.approach.4'),
  ];

  const contributeItems = [
    t('team.contribute.items.0'),
    t('team.contribute.items.1'),
    t('team.contribute.items.2'),
    t('team.contribute.items.3'),
    t('team.contribute.items.4'),
  ];

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/community">
              {t('hero.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/resources">{t('hero.learnMore')}</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            {t('mission.title')} & {t('vision.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            {t('mission.description')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
            <div className="text-2xl font-bold text-primary mb-2">
              <span className="block">نضال الروح</span>
              <span className="block text-lg">Nidal Al-Rouh</span>
            </div>
            <p className="text-muted-foreground">{t('mission.founded')}</p>
          </div>

          <div className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground">
              {t('vision.quote')}
            </blockquote>
            <p className="text-muted-foreground">{t('vision.meaning')}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            {t('currentStatus.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('currentStatus.subtitle')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-background/50 rounded-lg p-4"
            >
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-foreground font-medium">{achievement}</span>
            </div>
          ))}
        </div>
      </section>

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
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('targetUsers.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('targetUsers.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>{t('targetUsers.primary.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {targetUsersPrimary.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle>{t('targetUsers.secondary.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {targetUsersSecondary.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('phases.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('phases.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <Card
              key={index}
              className={`${phase.status === 'current' ? 'border-primary bg-primary/5' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{phase.title}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      phase.status === 'current' ? 'default' : 'secondary'
                    }
                  >
                    {phase.timeline}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {phase.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {phase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('cultural.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('cultural.subtitle')}
          </p>
        </div>

        <Card className="bg-gradient-to-r from-orange/5 to-red/5">
          <CardContent className="p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {culturalItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Open Source Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('openSource.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto italic">
            {t('openSource.description')}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {openSourceApproach.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('team.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                {t('team.founder.title')}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('team.founder.description')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  {t('team.contribute.title')}
                </h4>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                  {contributeItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-background/50 rounded-lg p-3"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-4">
                <h4 className="text-xl font-semibold text-foreground">
                  {t('team.joinUs')}
                </h4>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('team.joinDescription')}
                </p>
                <Button asChild size="lg">
                  <Link href="/contact">{t('team.getInvolved')}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
