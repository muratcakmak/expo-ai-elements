import { Message, MessageContent, MessageResponse } from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

const STATIC_MD = `Here are the **key benefits** of using TypeScript:

- Static type checking at \`compile time\`
- Better IDE support and autocompletion

\`\`\`bash
npm install typescript
\`\`\``;

// Streaming content includes both markdown AND LaTeX
const STREAMING_WITH_LATEX = `## Special Relativity

Einstein showed that energy and mass are related by $E = mc^2$, where $c$ is the speed of light.

The **Lorentz factor** is defined as:

$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$

### Time Dilation

A clock moving at velocity $v$ relative to an observer ticks slower:

$$\\Delta t' = \\gamma \\Delta t$$

For example, at $v = 0.9c$, the factor is $\\gamma \\approx 2.29$.

### Key Takeaway

As $v \\to c$, the Lorentz factor $\\gamma \\to \\infty$, meaning time effectively **stops** for a photon.`;

function useStreamSim(fullText: string) {
  const [text, setText] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const ref = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const words = React.useMemo(() => fullText.split(/(\s+)/), [fullText]);

  const play = React.useCallback(() => {
    setText('');
    setStreaming(true);
    let i = 0;
    const tick = () => {
      if (i < words.length) {
        const chunk = Math.min(Math.floor(Math.random() * 3) + 1, words.length - i);
        i += chunk;
        setText(words.slice(0, i).join(''));
        ref.current = setTimeout(tick, 50 + Math.random() * 80);
      } else {
        setStreaming(false);
      }
    };
    ref.current = setTimeout(tick, 300);
  }, [words]);

  const reset = React.useCallback(() => {
    if (ref.current) clearTimeout(ref.current);
    setText('');
    setStreaming(false);
  }, []);

  return { text, streaming, play, reset };
}

export function MessageResponseDemo() {
  const stream = useStreamSim(STREAMING_WITH_LATEX);

  return (
    <View className="gap-6">
      <PreviewSection title="Streaming with LaTeX" description="Tap Play — markdown + math formulas stream in real-time">
        <View className="mb-3 flex-row gap-2">
          <Button variant="outline" size="sm" onPress={stream.play}>
            <Text className="text-sm">Play</Text>
          </Button>
          <Button variant="ghost" size="sm" onPress={stream.reset}>
            <Text className="text-sm">Reset</Text>
          </Button>
        </View>
        <Message role="assistant">
          <MessageContent>
            <MessageResponse isStreaming={stream.streaming}>
              {stream.text}
            </MessageResponse>
          </MessageContent>
        </Message>
      </PreviewSection>

      <PreviewSection title="Static markdown" description="Rich text with bold, code, and lists">
        <Message role="assistant">
          <MessageContent>
            <MessageResponse>{STATIC_MD}</MessageResponse>
          </MessageContent>
        </Message>
      </PreviewSection>
    </View>
  );
}
