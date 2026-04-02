import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type CodeBlockProps = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
};

const CodeBlock = React.memo(function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const lines = React.useMemo(() => code.split('\n'), [code]);

  return (
    <View className={cn('bg-muted overflow-hidden rounded-lg', className)}>
      {/* Header bar */}
      <View className="border-border flex-row items-center justify-between border-b px-3 py-2">
        <Text className="text-muted-foreground text-xs font-medium">
          {language ?? 'code'}
        </Text>
        <Button variant="ghost" size="icon" onPress={handleCopy} className="h-7 w-7">
          <Icon
            as={copied ? CheckIcon : CopyIcon}
            className={cn('size-3.5', copied ? 'text-green-500' : 'text-muted-foreground')}
          />
        </Button>
      </View>

      {/* Code content */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row px-3 py-3">
          {showLineNumbers && (
            <View className="mr-3 items-end">
              {lines.map((_, index) => (
                <Text
                  key={index}
                  className="text-muted-foreground font-mono text-xs leading-5"
                >
                  {String(index + 1)}
                </Text>
              ))}
            </View>
          )}
          <View>
            {lines.map((line, index) => (
              <Text key={index} className="text-foreground font-mono text-xs leading-5">
                {line || ' '}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
export type { CodeBlockProps };
