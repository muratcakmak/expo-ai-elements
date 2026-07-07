import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from '../../src/code/code-block/CodeBlock';
import { Snippet } from '../../src/code/snippet/Snippet';
import { Terminal } from '../../src/code/terminal/Terminal';
import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from '../../src/code/stack-trace/StackTrace';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

const TS_SNIPPET = `import { useEffect, useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return count;
}`;

const TERMINAL_OUTPUT = `$ bun run build
[32m✓[0m compiled successfully in 1.2s
[36mℹ[0m 42 modules transformed
[33m⚠[0m 1 warning: unused export "foo"`;

const STACK_TRACE = `TypeError: Cannot read property 'map' of undefined
    at renderList (app/screens/List.tsx:42:18)
    at commitWork (node_modules/react-dom/cjs/react-dom.js:19023:14)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.js:22045:12)
    at handlePress (app/screens/List.tsx:88:5)`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: '800' }}>{title}</Text>
      {children}
    </View>
  );
}

export default function CodeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: '900' }}>Code</Text>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            CodeBlock, Terminal, Snippet, StackTrace
          </Text>
        </View>

        <Section title="CodeBlock (ts)">
          <DemoErrorBoundary label="CodeBlock failed">
            <CodeBlock code={TS_SNIPPET} language="ts" showLineNumbers>
              <CodeBlockHeader>
                <CodeBlockTitle>
                  <CodeBlockFilename>useCounter.ts</CodeBlockFilename>
                </CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopyButton />
                </CodeBlockActions>
              </CodeBlockHeader>
            </CodeBlock>
          </DemoErrorBoundary>
        </Section>

        <Section title="Snippet">
          <DemoErrorBoundary label="Snippet failed">
            <Snippet code="npx expo install expo-ai-elements" />
          </DemoErrorBoundary>
        </Section>

        <Section title="Terminal (ANSI)">
          <DemoErrorBoundary label="Terminal failed">
            <Terminal output={TERMINAL_OUTPUT} />
          </DemoErrorBoundary>
        </Section>

        <Section title="StackTrace">
          <DemoErrorBoundary label="StackTrace failed">
            <StackTrace trace={STACK_TRACE} defaultOpen>
              <StackTraceHeader>
                <StackTraceError>
                  <StackTraceErrorType />
                  <StackTraceErrorMessage />
                </StackTraceError>
                <StackTraceActions>
                  <StackTraceCopyButton />
                  <StackTraceExpandButton />
                </StackTraceActions>
              </StackTraceHeader>
              <StackTraceContent>
                <StackTraceFrames />
              </StackTraceContent>
            </StackTrace>
          </DemoErrorBoundary>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
