'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useGetHelperById } from '@/apis/helpers/queries/use-get-helper-by-id';
import HelperAboutSection from '@/components/helpers/profile/helper-about-section';
import HelperProfileHeader from '@/components/helpers/profile/helper-profile-header';
import HelperProfileSkeleton from '@/components/helpers/profile/helper-profile-skeleton';
import HelperStickyActionBar from '@/components/helpers/profile/helper-sticky-action-bar';
import ReviewsList from '@/components/helpers/profile/reviews-list';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useStickyScrolled from '@/hooks/use-sticky-scrolled';

const HelperProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const helperId = params.id as string;
  const locale = params.locale as string;
  const isRTL = locale === 'ar';

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCreatingDm, setIsCreatingDm] = useState(false);

  const { data: helper, isLoading, error } = useGetHelperById({ id: helperId });

  const t = useTranslations('helpers.discovery.profile');
  const isScrolled = useStickyScrolled(100);

  const handleMessage = () => {
    setIsCreatingDm(true);
    setTimeout(() => {
      toast.success(t('chatCreated'));
      setIsCreatingDm(false);
    }, 1000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(globalThis.location.href);
    toast.success(t('linkCopied'));
  };

  const handleBooking = () => {
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return <HelperProfileSkeleton />;
  }

  if (error || !helper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{t('notFound')}</h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToSearch')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container pb-8 space-y-8">
        <Button
          variant="ghost"
          className="hover:bg-muted/50 transition-colors -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToSearch')}
        </Button>
        <HelperProfileHeader
          helper={helper}
          isRTL={isRTL}
          onMessage={handleMessage}
          onBook={handleBooking}
          onShare={handleShare}
          isCreatingDm={isCreatingDm}
        />

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-1/4 grid-cols-2 mb-6">
            <TabsTrigger value="about">{t('about')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <HelperAboutSection
              bio={helper.bio}
              specializations={helper.specializations}
              languages={helper.languages}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsList helperId={helper.id} />
          </TabsContent>
        </Tabs>
      </div>

      <HelperStickyActionBar
        isVisible={isScrolled}
        onMessage={handleMessage}
        onBook={handleBooking}
        isCreatingDm={isCreatingDm}
        calUsername={helper.calUsername}
      />

      <Drawer open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{t('bookSession')}</DrawerTitle>
            <DrawerDescription>
              {t('bookingDescription', { name: helper.user.name })}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden p-4">
            <iframe
              src={`https://cal.com/${helper.calUsername}/30min?embed=true`}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Book a session"
              className="rounded-lg"
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t('close')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default HelperProfilePage;
