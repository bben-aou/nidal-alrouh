'use client';

import { Star } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

import { useGetHelperReviews } from '@/apis/helpers/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ReviewsListProps {
  helperId: string;
}

export function ReviewsList({ helperId }: Readonly<ReviewsListProps>) {
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
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row gap-4 space-y-0 pb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.image} alt={review.user.name} />
              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{review.user.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {format.dateTime(new Date(review.createdAt), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center text-yellow-500 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted stroke-muted-foreground'}`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          {review.comment && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
