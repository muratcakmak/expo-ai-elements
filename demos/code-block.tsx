import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/components/ai/code-block';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const jsCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;

const pythonCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))`;

export function CodeBlockDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="JavaScript" description="With line numbers and copy button">
        <CodeBlock code={jsCode} language="javascript">
          <CodeBlockHeader>
            <CodeBlockTitle>javascript</CodeBlockTitle>
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockContent code={jsCode} showLineNumbers />
        </CodeBlock>
      </PreviewSection>

      <PreviewSection title="Python" description="Without line numbers">
        <CodeBlock code={pythonCode} language="python">
          <CodeBlockHeader>
            <CodeBlockTitle>python</CodeBlockTitle>
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockContent code={pythonCode} />
        </CodeBlock>
      </PreviewSection>
    </View>
  );
}
