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
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { BotIcon, MoonStarIcon, SunIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

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

// Simulated streaming response
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

    // Simulate streaming response
    const fullResponse = getSimulatedResponse(content);
    let charIndex = 0;

    const stream = () => {
      if (charIndex < fullResponse.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        charIndex = Math.min(charIndex + chunkSize, fullResponse.length);
        const partial = fullResponse.slice(0, charIndex);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: partial, isStreaming: charIndex < fullResponse.length }
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
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, stop };
}

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('joke'))
    return "Why do programmers prefer dark mode?\n\nBecause **light attracts bugs**! 🐛\n\nOkay, here's a better one: Why did the React component feel bloated?\n\nBecause it had too many *side effects*. 😄";
  if (lower.includes('haiku'))
    return "Here's a haiku about coding:\n\n> *Code flows like water*\n> *Bugs emerge from silent depths*\n> *Tests bring peace of mind*";
  if (lower.includes('react native'))
    return "**React Native** is a framework for building native mobile apps using JavaScript and React.\n\n### Key Features\n\n- **Cross-platform** — Write once, run on iOS & Android\n- **Native performance** — Renders to real native components\n- **Hot reloading** — See changes instantly during development\n- **Large ecosystem** — Thousands of community libraries\n\n```javascript\nfunction App() {\n  return <Text>Hello, World!</Text>;\n}\n```\n\nWith **Expo**, you get even more out of the box — file-based routing, native APIs, and OTA updates.";
  if (lower.includes('what can'))
    return "I'm a demo of **expo-ai-elements** — a React Native component library for AI chat interfaces! 🚀\n\nThese components are available:\n\n1. `Conversation` — scrollable chat with auto-scroll\n2. `Message` — role-based message bubbles\n3. `MessageResponse` — streaming markdown rendering\n4. `PromptInput` — rich input with send/stop\n5. `Suggestion` — tappable suggestion chips\n6. `Shimmer` — loading animation\n\nTry sending me different messages to see markdown rendering in action!";
  return `You said: "${input}"\n\nThis is a **simulated response** demonstrating streaming markdown in \`expo-ai-elements\`.\n\nThe response streams in token by token, just like a real LLM API.`;
}

export default function ChatScreen() {
  const { messages, isLoading, sendMessage, stop } = useSimulatedChat();

  const SCREEN_OPTIONS = React.useMemo(
    () => ({
      title: 'AI Chat',
      headerRight: () => <ThemeToggle />,
    }),
    []
  );

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
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
        <PromptInput
          isLoading={isLoading}
          onSubmit={sendMessage}
          onStop={stop}
        />
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { theme } = useUniwind();

  function toggleTheme() {
    Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Button
      onPressIn={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full"
    >
      <Icon as={THEME_ICONS[theme ?? 'light']} className="size-5" />
    </Button>
  );
}
