import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { AppText, Icon } from '@/components/common';
import { Colors, FontSize, Spacing } from '@/constants';
import type { AiMessage } from '@/types/ai';

interface ChatBubbleProps {
  message: Pick<AiMessage, 'role' | 'text'>;
}

/** Round EcoBite mark shown next to assistant turns (leaf on solid green). */
function AiMark() {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="leaf" size={17} color={Colors.white} />
    </View>
  );
}

/**
 * Chat bubble (reference `.tn`): compact, max 78% width. Assistant = white / very
 * light neutral on the left with a leaf mark and a squared 6 px tail corner, no
 * border or shadow — green stays for the avatar, price, check marks and CTA, not
 * the conversation itself. Customer = light pastel blue on the right, dark neutral
 * text, evenly rounded (no tail) — deliberately not EcoBite green or the
 * assistant's tone, so the two sides read as distinct people.
 */
export function ChatBubble({ message }: ChatBubbleProps) {
  const mine = message.role === 'user';
  return (
    <View style={{ flexDirection: 'row', alignSelf: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', maxWidth: '78%', gap: Spacing.sm }}>
      {!mine ? <AiMark /> : null}
      <View
        style={{
          flexShrink: 1,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: mine ? 18 : 16,
          gap: Spacing.s6,
          backgroundColor: mine ? Colors.tileBlue : Colors.neutralSoft,
          ...(mine ? null : { borderBottomLeftRadius: 6 }),
        }}>
        <AppText color={mine ? 'text' : 'primaryText'} style={{ fontSize: FontSize.xs, lineHeight: 16 }}>
          {message.text}
        </AppText>
      </View>
    </View>
  );
}

/** One dot of `TypingBubble`, pulsing on its own delayed loop. */
function TypingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 340, useNativeDriver: true }),
        Animated.delay(600 - delay),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, opacity]);
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primaryDark, opacity }} />;
}

/** Subtle "Đang trả lời…" placeholder while the mock reply is on its way. */
export function TypingBubble() {
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'flex-end', gap: Spacing.sm }}>
      <AiMark />
      <View
        accessibilityLabel="Trợ lý đang trả lời"
        style={{ flexDirection: 'row', gap: 4, paddingVertical: 10, paddingHorizontal: 13, borderRadius: 16, borderBottomLeftRadius: 6, backgroundColor: Colors.neutralSoft }}>
        <TypingDot delay={0} />
        <TypingDot delay={150} />
        <TypingDot delay={300} />
      </View>
    </View>
  );
}
