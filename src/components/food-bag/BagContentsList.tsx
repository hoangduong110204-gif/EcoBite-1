import { View } from 'react-native';

import { AppText } from '@/components/common';
import { Colors } from '@/constants';

interface BagContentsListProps {
  items: string[];
}

/** "Trong túi thường có" bullet list (5.1): green 6 px dot + 12.5/600 text per line. */
export function BagContentsList({ items }: BagContentsListProps) {
  return (
    <View>
      {items.map((line) => (
        <View key={line} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary }} />
          <AppText variant="muted" style={{ fontSize: 12.5, flex: 1 }}>
            {line}
          </AppText>
        </View>
      ))}
    </View>
  );
}
