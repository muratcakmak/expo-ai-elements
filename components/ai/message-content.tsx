import { cn } from '@/lib/utils';
import { Shimmer } from '@/components/ai/shimmer';
import { useMessageContext } from '@/components/ai/message';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

// --- MessageResponse (renders markdown) ---

type MessageResponseProps = {
  children: string;
  isStreaming?: boolean;
  className?: string;
};

const MessageResponse = React.memo(
  function MessageResponse({ children, isStreaming, className }: MessageResponseProps) {
    return (
      <View className={cn('flex-1', className)}>
        <EnrichedMarkdownText markdown={children} />
        {isStreaming && children.length > 0 && (
          <Shimmer className="mt-1">Thinking...</Shimmer>
        )}
      </View>
    );
  },
  (prev, next) => prev.children === next.children && prev.isStreaming === next.isStreaming
);

MessageResponse.displayName = 'MessageResponse';

export { MessageResponse };
export type { MessageResponseProps };
