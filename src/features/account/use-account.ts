import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth';
import { useOrders } from '@/features/order-history/use-orders';
import { api } from '@/services/api';

import { formatMemberSince, getAccountSummary } from './account-logic';

/** Account screen data: the session profile (auth store), the account's orders and their summary. */
export function useAccount() {
  const { profile, area, account } = useAuth();
  const { orders, status, reload } = useOrders();
  const [memberSince, setMemberSince] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void api.getCurrentUser().then((user) => {
      if (!cancelled) setMemberSince(account && user.id === account.id ? formatMemberSince(user.memberSince) : null);
    });
    return () => {
      cancelled = true;
    };
  }, [account]);

  const summary = useMemo(() => getAccountSummary(orders), [orders]);
  return { profile, area, memberSince, summary, status, reload };
}
