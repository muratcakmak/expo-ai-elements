import {
  Conversation,
  Message,
  MessageContent,
  MessageText,
  MessageResponse,
  PromptInput,
  type MessageRole,
} from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

type ChatMsg = {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
};

const RESPONSES: Record<string, string> = {
  'explain euler': `## Euler's Identity

The most beautiful equation in mathematics:

$$e^{i\\pi} + 1 = 0$$

It connects five fundamental constants: $e$, $i$, $\\pi$, $1$, and $0$.

### Why It Works

From **Euler's formula**: $e^{ix} = \\cos(x) + i\\sin(x)$

Setting $x = \\pi$:

$$e^{i\\pi} = \\cos(\\pi) + i\\sin(\\pi) = -1 + 0i = -1$$

Therefore $e^{i\\pi} + 1 = 0$. `,

  'quadratic formula': `## Solving Quadratic Equations

For $ax^2 + bx + c = 0$, the solutions are:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### The Discriminant

The value $\\Delta = b^2 - 4ac$ determines the nature of roots:

- If $\\Delta > 0$: two distinct real roots
- If $\\Delta = 0$: one repeated root
- If $\\Delta < 0$: two complex conjugate roots

### Example

For $2x^2 - 4x + 1 = 0$:

$$x = \\frac{4 \\pm \\sqrt{16 - 8}}{4} = \\frac{4 \\pm 2\\sqrt{2}}{4} = 1 \\pm \\frac{\\sqrt{2}}{2}$$`,

  default: `## Mathematics Overview

The relationship between a function and its derivative:

$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$

This is the **chain rule**, one of the most fundamental rules in calculus.

For example, if $f(x) = \\sin(x^2)$, then:

$$f'(x) = \\cos(x^2) \\cdot 2x$$

The integral counterpart uses substitution:

$$\\int f(g(x)) \\cdot g'(x)\\,dx = F(g(x)) + C$$`,
};

function getResponse(input: string): string {
  const l = input.toLowerCase();
  if (l.includes('euler')) return RESPONSES['explain euler']!;
  if (l.includes('quadratic')) return RESPONSES['quadratic formula']!;
  return RESPONSES['default']!;
}

function useChat() {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const send = React.useCallback((text: string) => {
    const userMsg: ChatMsg = { id: Date.now().toString(), role: 'user', content: text };
    const asstMsg: ChatMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', isStreaming: true };

    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setLoading(true);

    const full = getResponse(text);
    const words = full.split(/(\s+)/);
    let i = 0;

    const tick = () => {
      if (i < words.length) {
        const chunk = Math.min(Math.floor(Math.random() * 3) + 1, words.length - i);
        i += chunk;
        const partial = words.slice(0, i).join('');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsg.id
              ? { ...m, content: partial, isStreaming: i < words.length }
              : m
          )
        );
        ref.current = setTimeout(tick, 50 + Math.random() * 80);
      } else {
        setLoading(false);
      }
    };
    ref.current = setTimeout(tick, 400);
  }, []);

  const stop = React.useCallback(() => {
    if (ref.current) clearTimeout(ref.current);
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
    setLoading(false);
  }, []);

  return { messages, loading, send, stop };
}

export function StreamingLatexDemo() {
  const { messages, loading, send, stop } = useChat();

  return (
    <View className="gap-6">
      <PreviewSection title="Chat with LaTeX streaming" description='Try "explain euler" or "quadratic formula"' className="p-0">
        <View style={{ height: 480 }}>
          {messages.length > 0 ? (
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
          ) : (
            <View className="flex-1 items-center justify-center p-4">
              <MessageText>Send a math question to see LaTeX streaming</MessageText>
            </View>
          )}
          <PromptInput isLoading={loading} onSubmit={send} onStop={stop} />
        </View>
      </PreviewSection>
    </View>
  );
}
