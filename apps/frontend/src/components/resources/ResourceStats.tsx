'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  mockResourceStats,
  type ResourceStats as ResourceStatsType,
} from '@/lib/mock-data/resources';

interface ResourceStatsProps {
  className?: string;
}

const ResourceStats = ({ className }: Readonly<ResourceStatsProps>) => {
  const t = useTranslations('resources');

  const labels = [
    t('dashboard.stats.articlesRead'),
    t('dashboard.stats.videosWatched'),
    t('dashboard.stats.podcastsListened'),
    t('dashboard.stats.guidesCompleted'),
  ];

  const patterns = [
    <svg className="opacity-50" width="100%" height="100%">
      <defs>
        <pattern
          id="articles-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#articles-pattern)" />
    </svg>,
    <svg className="opacity-50" width="100%" height="100%">
      <defs>
        <pattern
          id="videos-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 20h40M20 0v40"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#videos-pattern)" />
    </svg>,
    <svg className="opacity-50" width="100%" height="100%">
      <defs>
        <pattern
          id="podcasts-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="15"
            y="15"
            width="10"
            height="10"
            fill="currentColor"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#podcasts-pattern)" />
    </svg>,
    <svg className="opacity-50" width="100%" height="100%">
      <defs>
        <pattern
          id="guides-pattern"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="15" cy="15" r="2" fill="currentColor" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guides-pattern)" />
    </svg>,
  ];

  const iconBackgrounds = [
    'bg-blue-500/10',
    'bg-green-500/10',
    'bg-purple-500/10',
    'bg-orange-500/10',
  ];

  const resourceStats: ResourceStatsType[] = mockResourceStats.map(
    (stat, index) => ({
      ...stat,
      label: labels[index],
    })
  );

  return (
    <div
      className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
    >
      {resourceStats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-sm transition-all duration-300 hover:scale-[1.02]"
        >
          <Card className="relative h-full border-border/50 bg-card shadow-sm transition-all duration-300 overflow-hidden hover:border-border/80">
            <div className="absolute inset-0 text-foreground/5 group-hover:text-foreground/10 transition-colors duration-300">
              {patterns[index]}
            </div>

            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6">
              <div className="flex-1">
                <CardTitle className="text-sm font-semibold text-foreground/90 mb-2">
                  {stat.label}
                </CardTitle>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}/{stat.total}
                </div>
              </div>
              <div
                className={`p-2.5 rounded-xl ${iconBackgrounds[index]} border border-border/50 group-hover:scale-105 transition-transform duration-300 ml-3`}
              >
                <stat.icon className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>

            <CardContent className="relative pb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.completed')}
                </p>
                <div className="relative h-14 w-14">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-muted/40"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    {/* Progress Circle */}
                    <path
                      className={`${
                        index === 0
                          ? 'text-blue-500'
                          : index === 1
                            ? 'text-green-500'
                            : index === 2
                              ? 'text-purple-500'
                              : 'text-orange-500'
                      }`}
                      strokeDasharray={`${stat.progress}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">
                      {stat.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
export default ResourceStats;
