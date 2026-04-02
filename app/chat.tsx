import {
  Conversation,
  ConversationEmptyState,
  Message,
  MessageContent,
  MessageText,
  MessageResponse,
  PromptInput,
  Suggestions,
  Suggestion,
  type MessageRole,
} from '@/components/ai';
import { Icon } from '@/components/ui/icon';
import { BotIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
};

const SUGGESTIONS = [
  'What can you do?',
  'Tell me a joke',
  'Explain React Native',
  'Write a haiku',
];

function useSimulatedChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const streamRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const sendMessage = React.useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    const fullResponse = getResponse(content);
    let charIndex = 0;

    const stream = () => {
      if (charIndex < fullResponse.length) {
        const chunk = Math.floor(Math.random() * 3) + 1;
        charIndex = Math.min(charIndex + chunk, fullResponse.length);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: fullResponse.slice(0, charIndex), isStreaming: charIndex < fullResponse.length }
              : m
          )
        );
        streamRef.current = setTimeout(stream, 20 + Math.random() * 30);
      } else {
        setIsLoading(false);
      }
    };
    streamRef.current = setTimeout(stream, 500);
  }, []);

  const stop = React.useCallback(() => {
    if (streamRef.current) clearTimeout(streamRef.current);
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, stop };
}

function getResponse(input: string): string {
  const l = input.toLowerCase();
  if (l.includes('joke'))
    return "Why do programmers prefer dark mode?\n\nBecause **light attracts bugs**! 🐛";
  if (l.includes('haiku'))
    return "> *Code flows like water*\n> *Bugs emerge from silent depths*\n> *Tests bring peace of mind*";
  if (l.includes('react native'))
    return "**React Native** lets you build native mobile apps with JavaScript.\n\n### Key Features\n- Cross-platform\n- Native performance\n- Hot reloading\n\n```javascript\nfunction App() {\n  return <Text>Hello!</Text>;\n}\n```";
  if (l.includes('what can'))
    return "I'm a demo of **expo-ai-elements** 🚀\n\nComponents:\n1. `Conversation` — chat with auto-scroll\n2. `Message` — role-based bubbles\n3. `MessageResponse` — streaming markdown\n4. `PromptInput` — rich input\n5. `Suggestion` — chips\n6. And 20+ more!";
  return `You said: "${input}"\n\nThis is a **simulated streaming response** in \`expo-ai-elements\`.`;
}

export default function ChatScreen() {
  const { messages, isLoading, sendMessage, stop } = useSimulatedChat();

  return (
    <View className="bg-background flex-1">
      {messages.length === 0 ? (
        <View className="flex-1">
          <ConversationEmptyState
            title="expo-ai-elements"
            description="AI chat components for React Native"
            icon={<Icon as={BotIcon} className="text-muted-foreground size-12" />}
          />
          <Suggestions>
            {SUGGESTIONS.map((s) => (
              <Suggestion key={s} suggestion={s} onPress={sendMessage} />
            ))}
          </Suggestions>
        </View>
      ) : (
        <Conversation
          data={messages}
          renderItem={({ item }) => (
            <Message role={item.role}>
              <MessageContent>
                {item.role === 'assistant' ? (
                  <MessageResponse isStreaming={item.isStreaming}>
                    {item.content}
                  </MessageResponse>
                ) : (
                  <MessageText>{item.content}</MessageText>
                )}
              </MessageContent>
            </Message>
          )}
        />
      )}
      <PromptInput isLoading={isLoading} onSubmit={sendMessage} onStop={stop} />
    </View>
  );
}
