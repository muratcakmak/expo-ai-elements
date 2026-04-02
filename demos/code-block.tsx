import { CodeBlock } from '@/components/ai';
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
      <PreviewSection title="JavaScript" description="With line numbers">
        <CodeBlock code={jsCode} language="javascript" showLineNumbers />
      </PreviewSection>

      <PreviewSection title="Python">
        <CodeBlock code={pythonCode} language="python" />
      </PreviewSection>
    </View>
  );
}
