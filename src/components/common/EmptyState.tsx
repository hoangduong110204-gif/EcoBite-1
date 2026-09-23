import { StateLayout, type StateLayoutProps } from './StateLayout';

type EmptyStateProps = Omit<StateLayoutProps, 'tone'>;

/** Empty list / cart / results (reference 6.2). Never blank: pass actions that lead somewhere. */
export function EmptyState(props: EmptyStateProps) {
  return <StateLayout tone="mint" {...props} />;
}
