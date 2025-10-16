'use client';

import { DesktopCrisisButton } from './DesktopCrisisButton';
import { MobileCrisisButton } from './MobileCrisisButton';

export const CrisisButton = () => {
  return (
    <>
      <MobileCrisisButton />
      <DesktopCrisisButton />
    </>
  );
};
