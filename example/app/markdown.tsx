import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MessageResponse } from '../../src/chatbot/message/MessageResponse';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

/**
 * Rich markdown fixture exercising the react-native-streamdown +
 * react-native-enriched-markdown native renderer:
 *   - headings, bold / italic, inline code
 *   - fenced ts code block
 *   - GFM table (requires flavor="github" — enriched-markdown >= 0.6)
 *   - bullet + numbered lists (incl. nesting)
 *   - link, blockquote
 *   - CJK text
 *   - inline LaTeX math ($...$, needs md4cFlags.latexMath + RaTeX native dep)
 */
const FIXTURE = `# Markdown Streaming Demo

## Text formatting
This paragraph mixes **bold**, *italic*, and \`inline code\` together.

## Fenced code block
\`\`\`ts
type Role = 'user' | 'assistant';

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## GFM table
| Feature      | Supported | Notes                 |
| ------------ | :-------: | --------------------- |
| Tables       |    yes    | needs github flavor   |
| Lists        |    yes    | ordered + unordered   |
| Code blocks  |    yes    | fenced with language  |

## Lists
- First bullet
- Second bullet
  - Nested bullet
  - Another nested bullet

1. Step one
2. Step two
3. Step three

## Link and blockquote
Read more in the [Expo docs](https://docs.expo.dev).

> Streaming markdown is rendered natively, chunk by chunk.

## CJK
中文测试：这是一段用于验证多字节渲染的文本。

## Inline math
The area of a circle is $A = \\pi r^2$ and Euler's identity is $e^{i\\pi} + 1 = 0$.

## Special Relativity
Einstein showed that energy and mass are related by $E = mc^2$, where $c$ is the speed of light.

The **Lorentz factor** is defined as:

$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$

### Time Dilation
A clock moving at velocity $v$ relative to an observer ticks slower:

$$\\Delta t' = \\gamma \\Delta t$$

For example, at $v = 0.9c$, the factor is $\\gamma \\approx 2.29$.

### Key Takeaway
As $v \\to c$, the Lorentz factor $\\gamma \\to \\infty$, meaning time effectively **stops** for a photon.
`;

const CHUNK_SIZE = 6;
const TICK_MS = 50;

export default function MarkdownScreen() {
  const [runId, setRunId] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCharCount((count) => {
        const next = count + CHUNK_SIZE;
        if (next >= FIXTURE.length) {
          clearInterval(timer);
          return FIXTURE.length;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [runId]);

  const streamed = useMemo(() => FIXTURE.slice(0, charCount), [charCount]);
  const isDone = charCount >= FIXTURE.length;

  const restart = () => {
    setCharCount(0);
    setRunId((id) => id + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '900' }}>Markdown</Text>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          react-native-streamdown + enriched-markdown native rendering
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={restart}
            style={{
              backgroundColor: '#111',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Restart</Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {isDone ? 'streaming complete' : `streaming ${charCount}/${FIXTURE.length}`}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '800' }}>Streaming</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 12,
              minHeight: 120,
            }}
          >
            <DemoErrorBoundary label="StreamdownText (streaming) failed">
              <MessageResponse
                markdown={streamed}
                flavor="github"
                streamingAnimation
                md4cFlags={{ latexMath: true }}
                remendConfig={{ katex: true }}
              />
            </DemoErrorBoundary>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '800' }}>Static (full document)</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <DemoErrorBoundary label="StreamdownText (static) failed">
              <MessageResponse
                markdown={FIXTURE}
                flavor="github"
                md4cFlags={{ latexMath: true }}
              />
            </DemoErrorBoundary>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
