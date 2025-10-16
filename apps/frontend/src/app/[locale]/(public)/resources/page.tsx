'use client';

import {
  BookOpen,
  Video,
  FileText,
  Headphones,
  Search,
  Download,
  ExternalLink,
  Clock,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ResourcesPage() {
  const t = useTranslations('resources');
  const [searchTerm, setSearchTerm] = useState('');

  const resourceCategories = [
    {
      icon: BookOpen,
      title: t('categories.articles.title'),
      description: t('categories.articles.description'),
      count: '25+',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: Video,
      title: t('categories.videos.title'),
      description: t('categories.videos.description'),
      count: '15+',
      color: 'bg-red-500/10 text-red-600',
    },
    {
      icon: Headphones,
      title: t('categories.podcasts.title'),
      description: t('categories.podcasts.description'),
      count: '10+',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      icon: FileText,
      title: t('categories.guides.title'),
      description: t('categories.guides.description'),
      count: '8+',
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  const featuredResources = [
    {
      type: 'article',
      title: t('featured.mentalHealth.title'),
      description: t('featured.mentalHealth.description'),
      duration: '5 min read',
      rating: 4.8,
      tags: ['Mental Health', 'Wellness'],
    },
    {
      type: 'video',
      title: t('featured.stressManagement.title'),
      description: t('featured.stressManagement.description'),
      duration: '12 min watch',
      rating: 4.9,
      tags: ['Stress', 'Techniques'],
    },
    {
      type: 'guide',
      title: t('featured.selfCare.title'),
      description: t('featured.selfCare.description'),
      duration: '15 min read',
      rating: 4.7,
      tags: ['Self-Care', 'Daily Habits'],
    },
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'guide':
        return FileText;
      default:
        return BookOpen;
    }
  };

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

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('categories.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {resourceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto p-3 rounded-full w-fit ${category.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {category.count}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t('featured.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('featured.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredResources.map((resource, index) => {
            const Icon = getResourceIcon(resource.type);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {resource.rating}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{resource.description}</CardDescription>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {resource.duration}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('actions.view')}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t('newsletter.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder={t('newsletter.emailPlaceholder')}
              className="flex-1"
            />
            <Button>{t('newsletter.subscribe')}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
