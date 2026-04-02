import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type TerminalProps = {
  children: string;
  title?: string;
  className?: string;
};

const Terminal = React.memo(function Terminal({
  children,
  title,
  className,
}: TerminalProps) {
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleContentSizeChange = React.useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <View className={cn('overflow-hidden rounded-lg bg-black', className)}>
      {/* Optional header */}
      {title != null && (
        <View className="flex-row items-center border-b border-gray-700 px-3 py-2">
          <View className="mr-2 flex-row gap-1.5">
            <View className="h-3 w-3 rounded-full bg-red-500" />
            <View className="h-3 w-3 rounded-full bg-yellow-500" />
            <View className="h-3 w-3 rounded-full bg-green-500" />
          </View>
          <Text className="text-xs font-medium text-gray-400">{title}</Text>
        </View>
      )}

      {/* Terminal content */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
        className="max-h-80 px-3 py-3"
      >
        <Text className="font-mono text-xs leading-5 text-green-400">
          {children}
        </Text>
      </ScrollView>
    </View>
  );
});

Terminal.displayName = 'Terminal';

export { Terminal };
export type { TerminalProps };
