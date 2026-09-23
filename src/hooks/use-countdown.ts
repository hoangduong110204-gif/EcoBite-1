import { useCallback, useEffect, useState } from 'react';

import { tickCountdown } from '@/utils/countdown';

/**
 * Second-by-second countdown (e.g. OTP resend). `restart(seconds)` starts a
 * new run. Timer handling lives here, not in screens.
 */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(tickCountdown), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const restart = useCallback((seconds: number = initialSeconds) => setRemaining(seconds), [initialSeconds]);

  return { remaining, isDone: remaining <= 0, restart };
}
