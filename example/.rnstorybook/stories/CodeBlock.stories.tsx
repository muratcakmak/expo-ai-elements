import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from '../../../src/code/code-block/CodeBlock';

/**
 * CodeBlock — container that auto-renders its own scrollable content.
 *
 * The new root renders `children` (the header) followed by an internal
 * CodeBlockContent, so you only pass the header as a child. `showLineNumbers`
 * and `code`/`language` are props on the root. The copy button reads the code
 * from context and copies it via expo-clipboard (no permission prompt).
 */

const TS_CODE = `import { useCallback, useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, reset };
}`;

const PYTHON_CODE = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))`;

const meta: Meta = {
  title: 'Code/CodeBlock',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const TypeScriptWithHeader: StoryObj = {
  name: 'TypeScript — filename + copy + line numbers',
  render: () => (
    <CodeBlock code={TS_CODE} language="typescript" showLineNumbers>
      <CodeBlockHeader>
        <CodeBlockTitle>
          <CodeBlockFilename>useCounter.ts</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
    </CodeBlock>
  ),
};

export const PythonNoLineNumbers: StoryObj = {
  name: 'Python — no line numbers',
  render: () => (
    <CodeBlock code={PYTHON_CODE} language="python">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <CodeBlockFilename>fib.py</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
    </CodeBlock>
  ),
};
