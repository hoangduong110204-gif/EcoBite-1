import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AiSuggestionChip, ChatBubble, ChatComposer, SuggestionList, TypingBubble, type AiRecommendationItem } from '@/components/ai';
import { AppText, Header, Icon, IconTile, Screen } from '@/components/common';
import { Colors, Spacing } from '@/constants';
// Resolved here, not inside `components/ai`: components stay presentational (no
// `@/data` imports), and this file (unlike the ones the verify script executes
// under plain Node) is only ever text-scanned, never imported/run outside Metro —
// safe to pull in real bundled photos via the presentation mock.
import { getRecommendationPresentation } from '@/data/ai/recommendation-presentations';
import { useAiChat } from '@/features/ai';
import { useBack } from '@/hooks';
import type { AiSuggestion } from '@/types/ai';

/**
 * 11.1 AI Assistant: a conversational, messenger-style screen wired to the MOCK AI
 * service (no real AI). User bubbles on the right, assistant bubbles on the left with
 * a small leaf mark; recommendations render as compact cards under the assistant's
 * message. The conversation is kept for the session.
 */
export default function AiAssistantScreen() {
  const router = useRouter();
  const goBack = useBack('/home');
  const { messages, isReplying, send, greeting, quickPrompts } = useAiChat();
  const [text, setText] = useState('');
  const scroller = useRef<ScrollView>(null);

  // keep the latest message in view
  useEffect(() => {
    scroller.current?.scrollToEnd({ animated: true });
  }, [messages.length, isReplying]);

  const submit = (value: string) => {
    if (!value.trim() || isReplying) return;
    void send(value);
    setText('');
  };

  const open = ({ target }: AiSuggestion) => {
    if (!target) return;
    if (target.type === 'restaurant') router.push({ pathname: '/restaurant/[id]', params: { id: target.id } });
    else router.push({ pathname: '/food-bag/[id]', params: { id: target.id } });
  };

  /** Resolves each suggestion's `{type, id}` against the AI-only presentation mock (photo, price, rating). At most 2, so one reply never takes over the screen. */
  const buildRecommendations = (suggestions: AiSuggestion[]): AiRecommendationItem[] =>
    suggestions
      .filter((s) => s.target)
      .slice(0, 2)
      .map((s) => {
        const target = s.target!;
        const presentation = getRecommendationPresentation(target.type, target.id);
        return {
          key: s.id,
          label: s.label,
          image: presentation?.image,
          price: presentation?.price,
          rating: presentation?.rating,
          reasons: s.reasons,
          onPress: () => open(s),
        };
      });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        scroll={false}
        padded={false}
        safeBottom
        header={
          <Header
            titleNode={
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.mint, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="leaf" size={16} color={Colors.primaryDark} />
                </View>
                <AppText variant="navTitle" numberOfLines={1}>
                  EcoBite AI
                </AppText>
              </View>
            }
            onBack={goBack}
            right={
              <Pressable accessibilityRole="button" accessibilityLabel="Lịch sử trò chuyện" hitSlop={8} onPress={() => router.push('/ai/history')}>
                <IconTile name="clock" tone="neutral" size="sm" />
              </Pressable>
            }
          />
        }
        footer={<ChatComposer value={text} onChangeText={setText} onSend={() => submit(text)} disabled={isReplying} placeholder="Bạn muốn ăn gì hôm nay?" />}>
        <ScrollView
          ref={scroller}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm, flexGrow: 1 }}>
          <AppText variant="caption" color="textFaint" style={{ textAlign: 'center' }}>
            Bản thử nghiệm: câu trả lời được mô phỏng.
          </AppText>
          {messages.length === 0 ? (
            <View style={{ alignItems: 'center', gap: Spacing.s10, paddingVertical: Spacing.md }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.mint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="leaf" size={26} color={Colors.primaryDark} />
              </View>
              <AppText variant="bodyStrong" style={{ textAlign: 'center', fontSize: 15, lineHeight: 21 }}>
                {greeting}
              </AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm }}>
                {quickPrompts.map((prompt) => (
                  <AiSuggestionChip key={prompt} label={prompt} onPress={() => submit(prompt)} />
                ))}
              </View>
            </View>
          ) : (
            <ChatBubble message={{ role: 'assistant', text: greeting }} />
          )}
          {messages.map((m) => (
            <View key={m.id} style={{ gap: Spacing.s6, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <ChatBubble message={m} />
              {m.suggestions && m.suggestions.length > 0 ? (
                <View style={{ width: '100%', paddingLeft: 42 }}>
                  <SuggestionList items={buildRecommendations(m.suggestions)} />
                </View>
              ) : null}
            </View>
          ))}
          {isReplying ? <TypingBubble /> : null}
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}
