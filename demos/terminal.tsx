import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalTitle,
} from '@/components/ai/terminal';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

const npmOutput = `$ npm install expo-router

added 127 packages in 4.2s

12 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`;

export function TerminalDemo() {
  const [output, setOutput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(true);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < npmOutput.length) {
        setOutput(npmOutput.slice(0, index + 8));
        index += 8;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleClear = React.useCallback(() => {
    setOutput('');
    setIsStreaming(false);
  }, []);

  return (
    <View className="gap-6">
      <PreviewSection title="npm install output" description="With streaming simulation, copy and clear">
        <Terminal output={output} isStreaming={isStreaming} onClear={handleClear}>
          <TerminalHeader>
            <TerminalTitle>npm install</TerminalTitle>
            <TerminalActions>
              <TerminalCopyButton />
              <TerminalClearButton />
            </TerminalActions>
          </TerminalHeader>
          <TerminalContent />
        </Terminal>
      </PreviewSection>
    </View>
  );
}
