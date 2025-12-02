'use client';

import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useGetHelperById } from '@/apis/helpers/queries';
import { HelperBookingWidget } from '@/components/helpers/helper-booking-widget';
import { HelperProfileSidebar } from '@/components/helpers/helper-profile-sidebar';
import { ReviewsList } from '@/components/helpers/reviews-list';
import { Button } from '@/components/ui/button';

export default function HelperProfilePage() {
  const t = useTranslations('helpers.discovery.profile');
  const tCommon = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const helperId = params.id as string;

  const { data: helper, isLoading } = useGetHelperById({ id: helperId });

  if (isLoading) {
    return <div className="container py-8">{tCommon('general.loading')}</div>;
  }

  if (!helper) {
    return <div className="container py-8">{t('notFound')}</div>;
  }

  return (
    <div className="container py-8 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:bg-transparent"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToSearch')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <HelperProfileSidebar helper={helper} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <HelperBookingWidget calUsername={helper.calUsername} />

          <div id="reviews">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t('reviews')}
            </h3>
            <ReviewsList helperId={helper.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
