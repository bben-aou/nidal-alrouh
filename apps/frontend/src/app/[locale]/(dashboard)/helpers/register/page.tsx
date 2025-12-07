'use client';

import { ArrowLeft, ArrowRight, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCreateHelper } from '@/apis/helpers/queries';
import { ProgressStepper } from '@/components/helpers/progress-stepper';
import { StepCalIntegration } from '@/components/helpers/step-cal-integration';
import { StepLegalDisclaimer } from '@/components/helpers/step-legal-disclaimer';
import { StepProfileInfo } from '@/components/helpers/step-profile-info';
import { SuccessMessage } from '@/components/helpers/success-message';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  isCalValid,
  isLegalValid,
  isProfileValid,
} from '@/utils/validation/helpers-registration';

interface HelperFormData {
  bio: string;
  specializations: string[];
  languages: string[];
  maxSessionsPerWeek: number;
  calUsername: string;
  agreesToTerms: boolean;
}

export default function BecomeHelperPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<HelperFormData>({
    bio: '',
    specializations: [],
    languages: [],
    maxSessionsPerWeek: 4,
    calUsername: '',
    agreesToTerms: false,
  });

  const router = useRouter();
  const { refreshAuth } = useAuth();
  const t = useTranslations('helpers.registration');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { mutateAsync: createHelper, isPending: isSubmitting } =
    useCreateHelper();

  const STEP_COUNT = 3 as const;
  const STEP_SEQUENCE = [1, 2, 3] as const;

  const hasAcceptedTerms = isLegalValid({
    agreesToTerms: formData.agreesToTerms,
  });
  const isProfileComplete = isProfileValid({
    bio: formData.bio,
    specializations: formData.specializations,
    languages: formData.languages,
    maxSessionsPerWeek: formData.maxSessionsPerWeek,
  });

  const isNextButtonDisabled =
    isSubmitting ||
    (currentStep === 1 && !hasAcceptedTerms) ||
    (currentStep === 2 && !isProfileComplete);
  const isPreviousButtonDisabled = currentStep === 1 || isSubmitting;
  const isSubmitButtonDisabled =
    isSubmitting || !isCalValid({ calUsername: formData.calUsername });

  const handleNext = () => {
    if (currentStep < STEP_COUNT) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleDataChange = (data: Partial<HelperFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      await createHelper({
        bio: formData.bio,
        specializations: formData.specializations,
        languages: formData.languages,
        maxSessionsPerWeek: formData.maxSessionsPerWeek,
        calUsername: formData.calUsername,
      });

      await refreshAuth();
      setIsSuccess(true);

      setTimeout(() => {
        router.push('/helpers/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Helper registration error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create helper profile'
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="container max-w-2xl py-20">
        <SuccessMessage />
      </div>
    );
  }

  return (
    <div className="container pb-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      <Alert className="border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-100 mb-8 mx-auto relative z-20">
        <UserCog className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="font-semibold text-amber-800 dark:text-amber-300">
          {t('legal.professionalWarning.title')}
        </AlertTitle>
        <AlertDescription className="text-amber-800/90 dark:text-amber-200/90 mt-1 bg-transparent">
          {t('legal.professionalWarning.message')}
        </AlertDescription>
      </Alert>

      <ProgressStepper currentStep={currentStep} steps={STEP_SEQUENCE} />

      <div className="bg-card border border-border/50 rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 p-12 -ml-16 -mb-16 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 min-h-[400px]">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepLegalDisclaimer
                agreesToTerms={formData.agreesToTerms}
                onDataChange={handleDataChange}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepProfileInfo
                data={formData}
                onDataChange={handleDataChange}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepCalIntegration
                calUsername={formData.calUsername}
                onDataChange={handleDataChange}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
          {isRTL ? (
            <>
              {currentStep < STEP_COUNT ? (
                <Button
                  onClick={handleNext}
                  disabled={isNextButtonDisabled}
                  className="px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {t('buttons.next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitButtonDisabled}
                  className="px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isPreviousButtonDisabled}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('buttons.previous')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isPreviousButtonDisabled}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('buttons.previous')}
              </Button>
              {currentStep < STEP_COUNT ? (
                <Button
                  onClick={handleNext}
                  disabled={isNextButtonDisabled}
                  className="px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {t('buttons.next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitButtonDisabled}
                  className="px-8 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
