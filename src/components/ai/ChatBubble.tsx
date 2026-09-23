import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/common';
import { Colors, FontSize, Spacing } from '@/constants';
import type { AiMessage } from '@/types/ai';

interface ChatBubbleProps {
  message: Pick<AiMessage, 'role' | 'text'>;
  /** Short structured content inside an assistant bubble (e.g. `SuggestionList`). */
  children?: ReactNode;
}

/**
 * Chat bubble (reference `.tn`): compact, max 82% width, radius 17 with a squared
 * 6 px tail corner. User = green on the right; assistant = soft neutral on the
 * left, without border or shadow, so a conversation reads like a messenger, not a
 * stack of cards.
 */
export function ChatBubble({ message, children }: ChatBubbleProps) {
  const mine = message.role === 'user';
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '82%',
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 17,
        gap: Spacing.s6,
        backgroundColor: mine ? Colors.primary : Colors.neutralSoft,
        ...(mine ? { borderBottomRightRadius: 6 } : { borderBottomLeftRadius: 6 }),
      }}>
      <AppText color={mine ? 'textOnPrimary' : 'text'} style={{ fontSize: FontSize.small, lineHeight: 19 }}>
        {message.text}
      </AppText>
      {children}
    </View>
  );
}

/** "Đang trả lời…" placeholder while the mock reply is on its way. */
export function TypingBubble() {
  return (
    <View
      accessibilityLabel="Trợ lý đang trả lời"
      style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 4, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 17, borderBottomLeftRadius: 6, backgroundColor: Colors.neutralSoft }}>
      {[0.35, 0.6, 0.9].map((opacity) => (
        <View key={opacity} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted, opacity }} />
      ))}
    </View>
  );
}
