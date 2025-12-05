'use client';

import { Star } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

import { useGetHelperReviews } from '@/apis/helpers/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewsListProps {
  helperId: string;
}

const ReviewsList = ({ helperId }: Readonly<ReviewsListProps>) => {
  const t = useTranslations('helpers.discovery.profile');
  const format = useFormatter();

  const { reviews, isLoading } = useGetHelperReviews(helperId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">{t('loadingReviews')}</div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          {t('noReviews')}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const name = review.seeker?.name ?? review.user?.name ?? 'Anonymous';
        const avatarSrc =
          review.seeker?.avatarUrl ?? review.user?.image ?? undefined;

        return (
          <Card
            key={review.id}
            className="overflow-hidden border border-border/50"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12 border-2 border-border flex-shrink-0">
                  <AvatarImage src={avatarSrc} alt={name} />
                  <AvatarFallback className="bg-muted text-foreground font-medium">
                    {name?.charAt(0) ?? '?'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-base text-foreground">
                        {name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'fill-none text-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {format.dateTime(new Date(review.createdAt), {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  {review.comment && (
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReviewsList;
