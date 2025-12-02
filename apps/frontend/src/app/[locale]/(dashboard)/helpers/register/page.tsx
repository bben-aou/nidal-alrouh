'use client';

import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCreateHelper } from '@/apis/helpers/queries';
import { StepCalIntegration } from '@/components/helpers/step-cal-integration';
import { StepLegalDisclaimer } from '@/components/helpers/step-legal-disclaimer';
import { StepProfileInfo } from '@/components/helpers/step-profile-info';
import { SuccessMessage } from '@/components/helpers/success-message';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';

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
  const { mutateAsync: createHelper, isPending: isSubmitting } =
    useCreateHelper();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

      // Refresh user context to update role
      await refreshAuth();

      // Show success message
      setIsSuccess(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push('/helpers/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Helper registration error:', error);
      // The hook handles error state, but we can also show an alert or toast here if needed
      // Using the error from the catch block which comes from the hook promise rejection
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create helper profile'
      );
    }
  };

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {t('step')} {currentStep} {t('of')} {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step < currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : step === currentStep
                        ? 'border-primary text-primary'
                        : 'border-muted text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center">
                  {t(`steps.${step}.label`)}
                </span>
              </div>
            ))}
          </div>

          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <StepLegalDisclaimer
                agreesToTerms={formData.agreesToTerms}
                onDataChange={handleDataChange}
              />
            )}
            {currentStep === 2 && (
              <StepProfileInfo
                data={formData}
                onDataChange={handleDataChange}
              />
            )}
            {currentStep === 3 && (
              <StepCalIntegration
                calUsername={formData.calUsername}
                onDataChange={handleDataChange}
              />
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('buttons.previous')}
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  isSubmitting ||
                  (currentStep === 1 && !formData.agreesToTerms) ||
                  (currentStep === 2 &&
                    (!formData.bio ||
                      formData.bio.length < 50 ||
                      formData.specializations.length === 0 ||
                      formData.languages.length === 0))
                }
              >
                {t('buttons.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.calUsername}
              >
                {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
