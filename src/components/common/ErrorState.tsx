import { StateLayout, type StateLayoutProps } from './StateLayout';

interface ErrorStateProps extends Omit<StateLayoutProps, 'tone'> {
  /** `danger` (payment failed, generic error) or `warning` (hold expired, sold out). */
  tone?: 'danger' | 'warning';
}

/** Error / exception result (reference 7.4, 7.5, 5.7): tinted circle, message, recovery actions. */
export function ErrorState({ tone = 'danger', icon = 'warning', ...rest }: ErrorStateProps) {
  return <StateLayout tone={tone === 'warning' ? 'amber' : 'danger'} icon={icon} {...rest} />;
}
