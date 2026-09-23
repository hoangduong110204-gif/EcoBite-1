import { View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { Colors, Spacing } from '@/constants';

interface PaymentSuccessHeroProps {
  title: string;
  message: string;
}

/** Payment Success hero (reference 7.3): 118 px green disc with a check, title and one line of text. */
export function PaymentSuccessHero({ title, message }: PaymentSuccessHeroProps) {
  return (
    <View style={{ alignItems: 'center', gap: Spacing.s14, paddingTop: Spacing.s18 }}>
      <View
        style={{
          width: 118,
          height: 118,
          borderRadius: 59,
          backgroundColor: Colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.72,
          shadowRadius: 20,
          elevation: 10,
        }}>
        <Icon name="check" size={56} color={Colors.white} strokeWidth={3} />
      </View>
      <View style={{ alignItems: 'center', gap: Spacing.s6 }}>
        <AppText variant="title">{title}</AppText>
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          {message}
        </AppText>
      </View>
    </View>
  );
}
