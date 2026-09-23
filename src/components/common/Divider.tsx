import { View, type ViewStyle } from 'react-native';

import { Colors } from '@/constants';

interface DividerProps {
  /** Dashed rule with the stronger border colour (total row, `.tien.tong`). */
  dashed?: boolean;
  style?: ViewStyle;
}

/** 1 px rule (`--ke-2`), or the dashed total rule (1.4 px, `--ke`). */
export function Divider({ dashed = false, style }: DividerProps) {
  return (
    <View
      style={[
        dashed
          ? { borderTopWidth: 1.4, borderStyle: 'dashed', borderColor: Colors.border }
          : { height: 1, backgroundColor: Colors.divider },
        style,
      ]}
    />
  );
}
