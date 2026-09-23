import { View } from 'react-native';

import { Colors, RadioStyles } from '@/constants';

import { Icon } from './icons';

/** 20 px radio dot: white ring when off, solid green with a check when on. */
export function RadioDot({ selected }: { selected: boolean }) {
  return (
    <View
      style={[
        {
          width: RadioStyles.size,
          height: RadioStyles.size,
          borderRadius: RadioStyles.size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        selected ? RadioStyles.on : RadioStyles.off,
      ]}>
      {selected ? <Icon name="check" size={12} color={Colors.white} strokeWidth={3} /> : null}
    </View>
  );
}
