'use client';

import Image from 'next/image';
import { useState } from 'react';

import heroImage from '@/assets/login.png';

import { ForgotPasswordFields } from './components/forgot-password-fields';
import { FormFooter } from './components/form-footer';
import { FormHeader } from './components/form-header';
import { SuccessView } from './components/success-view';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  if (isSuccess) {
    return <SuccessView email={email} />;
  }

  return (
    <div className="flex h-full w-full p-6">
      <div className="flex w-full gap-6 max-w-7xl mx-auto">
        <div className="block sm:hidden md:hidden lg:block lg:flex-1 relative rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
          <Image
            src={heroImage}
            alt="Journey of healing"
            fill
            sizes="50vw"
            className="object-cover rounded-2xl"
            quality={100}
            priority
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[440px] space-y-6">
            <FormHeader />
            <ForgotPasswordFields
              onSuccess={(submittedEmail) => {
                setEmail(submittedEmail);
                setIsSuccess(true);
              }}
            />
            <FormFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
