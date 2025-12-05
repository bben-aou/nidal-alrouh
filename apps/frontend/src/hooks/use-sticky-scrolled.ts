'use client';

import { useEffect, useState } from 'react';

const useStickyScrolled = (threshold = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return isScrolled;
};
export default useStickyScrolled;
