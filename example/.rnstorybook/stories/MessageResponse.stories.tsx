import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Message, MessageContent } from '../../../src/chatbot/message/Message';
import { MessageResponse } from '../../../src/chatbot/message/MessageResponse';
import { DemoErrorBoundary } from '../../components/DemoErrorBoundary';

/**
 * MessageResponse — the flagship StreamdownText-based renderer.
 *
 * The 0.2.0 API takes the raw markdown string via the `markdown` prop (NOT
 * children). Extended features are opt-in:
 *   - flavor="github"           → GFM (tables, task lists, ...)
 *   - md4cFlags.latexMath       → inline `$...$` + display `$$...$$` math
 *   - remendConfig.katex        → KaTeX rendering for the math
 *   - streamingAnimation        → smooth chunk-by-chunk reveal
 */

const STATIC_MD = `Here are the **key benefits** of using TypeScript:

- Static type checking at \`compile time\`
- Better IDE support and autocompletion
- Safer refactors across large codebases

\`\`\`bash
npm install typescript
\`\`\`

| Feature       | TS  | JS  |
| ------------- | :-: | :-: |
| Static types  | yes | no  |
| Autocomplete  | yes | ~   |`;

// Streaming content mixes markdown AND LaTeX (inline + display math).
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

/** A tiny word-by-word streaming simulator (mirrors useStreamSim from the old demo). */
function useStreamSim(fullText: string) {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const words = useMemo(() => fullText.split(/(\s+)/), [fullText]);

  const play = useCallback(() => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
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

  const reset = useCallback(() => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    setText('');
    setStreaming(false);
  }, []);

  return { text, streaming, play, reset };
}

function DemoButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>{label}</Text>
    </Pressable>
  );
}

function StreamingLatexDemo() {
  const stream = useStreamSim(STREAMING_WITH_LATEX);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 12, color: '#6b7280' }}>
        Tap Play — markdown + LaTeX stream in word by word.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <DemoButton
          label={stream.streaming ? 'Streaming…' : 'Play'}
          onPress={stream.play}
          disabled={stream.streaming}
        />
        <DemoButton label="Reset" onPress={stream.reset} />
      </View>
      <Message from="assistant">
        <MessageContent from="assistant">
          <DemoErrorBoundary label="MessageResponse (streaming) failed">
            <MessageResponse
              markdown={stream.text || '_Press **Play** to start streaming…_'}
              flavor="github"
              streamingAnimation
              md4cFlags={{ latexMath: true }}
              remendConfig={{ katex: true }}
            />
          </DemoErrorBoundary>
        </MessageContent>
      </Message>
    </View>
  );
}

const meta: Meta = {
  title: 'Chatbot/MessageResponse',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const StaticMarkdown: StoryObj = {
  name: 'Static markdown + GFM table',
  render: () => (
    <Message from="assistant">
      <MessageContent from="assistant">
        <DemoErrorBoundary label="MessageResponse (static) failed">
          <MessageResponse
            markdown={STATIC_MD}
            flavor="github"
            md4cFlags={{ latexMath: true }}
          />
        </DemoErrorBoundary>
      </MessageContent>
    </Message>
  ),
};

export const StreamingWithLatex: StoryObj = {
  name: 'Streaming with LaTeX',
  render: () => <StreamingLatexDemo />,
};
