import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { ChatBubble, ChatComposer, SuggestionList, TypingBubble } from '@/components/ai';
import { AppText, Chip, Header, Icon, Screen } from '@/components/common';
import { Colors, Spacing } from '@/constants';
import { useAiChat } from '@/features/ai';
import { useBack } from '@/hooks';
import type { AiSuggestion } from '@/types/ai';

/**
 * 11.1 AI Assistant: a plain messenger-style conversation wired to the MOCK AI
 * service (no real AI). User bubbles on the right, assistant bubbles on the left;
 * suggestions sit inside the assistant bubble. The conversation is kept for the session.
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

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        scroll={false}
        padded={false}
        safeBottom
        header={
          <Header
            title="Trợ lý EcoBite"
            onBack={goBack}
            right={
              <Pressable accessibilityRole="button" accessibilityLabel="Lịch sử trò chuyện" hitSlop={8} onPress={() => router.push('/ai/history')}>
                <Icon name="clock" size={20} color={Colors.text} />
              </Pressable>
            }
          />
        }
        footer={<ChatComposer value={text} onChangeText={setText} onSend={() => submit(text)} disabled={isReplying} />}>
        <ScrollView
          ref={scroller}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Spacing.md, gap: Spacing.s10, flexGrow: 1 }}>
          <AppText variant="caption" color="textFaint" style={{ textAlign: 'center' }}>
            Bản thử nghiệm: câu trả lời được mô phỏng.
          </AppText>
          <ChatBubble message={{ role: 'assistant', text: greeting }} />
          {messages.length === 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs }}>
              {quickPrompts.map((prompt) => (
                <Chip key={prompt} label={prompt} onPress={() => submit(prompt)} />
              ))}
            </View>
          ) : null}
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m}>
              {m.suggestions && m.suggestions.length > 0 ? <SuggestionList suggestions={m.suggestions} onOpen={open} /> : null}
            </ChatBubble>
          ))}
          {isReplying ? <TypingBubble /> : null}
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}
