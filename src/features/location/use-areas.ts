import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { Area } from '@/types';

/** Loads the selectable areas (Select Location). */
export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setAreas(await api.listAreas());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { areas, status, reload: load };
}
