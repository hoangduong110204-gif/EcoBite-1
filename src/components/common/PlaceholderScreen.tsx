import { Link, type Href } from 'expo-router';
import { View } from 'react-native';

import { Spacing } from '@/constants';

import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';
import { Screen } from './Screen';

export interface PlaceholderLink {
  label: string;
  href: Href;
}

interface PlaceholderScreenProps {
  /** MVP screen number, e.g. "06". Omit for non-MVP routes. */
  number?: string;
  title: string;
  group: string;
  links?: PlaceholderLink[];
}

/**
 * Temporary stand-in used ONLY to verify navigation. Replaced by real screens
 * when the 82-screen reference is implemented.
 */
export function PlaceholderScreen({ number, title, group, links = [] }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Card variant="mint" style={{ gap: Spacing.xs }}>
        <AppText variant="label" color="primaryDark">
          {group}
          {number ? ` · ${number}` : ''}
        </AppText>
        <AppText variant="title">{title}</AppText>
        <AppText color="textMuted">Placeholder screen — navigation check only.</AppText>
      </Card>
      <View style={{ gap: Spacing.sm, marginTop: Spacing.lg }}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} asChild>
            <Button label={link.label} variant="secondary" />
          </Link>
        ))}
      </View>
    </Screen>
  );
}
