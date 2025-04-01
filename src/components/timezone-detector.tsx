'use client';

import { useEffect } from 'react';

import { setClientTimezone } from '@/actions/time';

export function TimezoneDetector() {
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setClientTimezone(timeZone);
  }, []);

  return null;
}
