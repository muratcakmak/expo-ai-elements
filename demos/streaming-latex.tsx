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

  default: `## Advanced Mathematics

### Gaussian Integral

One of the most remarkable results in analysis:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### Matrix Transformation

A rotation matrix in $\\mathbb{R}^2$ by angle $\\theta$:

$$R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$

### Taylor Series

The exponential function expanded around $x = 0$:

$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$

### Nested Fractions & Continued Fractions

The golden ratio $\\phi = \\frac{1 + \\sqrt{5}}{2}$ satisfies:

$$\\phi = 1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cdots}}}$$

### Bayes' Theorem

For events $A$ and $B$ where $P(B) \\neq 0$:

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{\\sum_{i} P(B|A_i) \\cdot P(A_i)}$$

### Schrödinger Equation

The time-dependent form with Hamiltonian $\\hat{H}$:

$$i\\hbar \\frac{\\partial}{\\partial t} |\\Psi(t)\\rangle = \\hat{H} |\\Psi(t)\\rangle$$

Inline math mixed with text: The wave function $\\Psi(x,t) = Ae^{i(kx - \\omega t)}$ gives probability density $|\\Psi|^2$.`,
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
