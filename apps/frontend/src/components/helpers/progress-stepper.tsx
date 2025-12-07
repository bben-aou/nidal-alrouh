'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProgressStepperProps {
  currentStep: number;
  steps: readonly number[];
}

export function ProgressStepper({
  currentStep,
  steps,
}: Readonly<ProgressStepperProps>) {
  const t = useTranslations('helpers.registration');

  const widthClass = (() => {
    if (steps.length === 3) {
      if (currentStep <= 1) return 'w-0';
      if (currentStep === 2) return 'w-1/2';
      return 'w-full';
    }
    const ratio = (currentStep - 1) / (steps.length - 1);
    if (ratio <= 0) return 'w-0';
    if (ratio < 0.25) return 'w-1/4';
    if (ratio < 0.5) return 'w-1/2';
    if (ratio < 0.75) return 'w-3/4';
    return 'w-full';
  })();

  return (
    <div className="relative">
      <div className="flex justify-between mb-8 relative z-10">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div
              key={step}
              className="flex flex-col items-center flex-1 relative group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
                    : isCurrent
                      ? 'bg-background border-primary text-primary shadow-lg ring-4 ring-primary/10 scale-110'
                      : 'bg-background border-muted-foreground/20 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              <span
                className={`text-sm mt-3 font-medium transition-colors duration-200 ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {t(`steps.${step}.label`)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0 rounded-full" />
      <div
        className={`absolute top-5 left-0 h-0.5 bg-primary -z-0 rounded-full transition-all duration-500 ease-in-out ${widthClass}`}
      />
    </div>
  );
}
