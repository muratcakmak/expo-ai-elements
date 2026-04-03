import { cn } from '@/lib/utils';
import { Shimmer } from '@/components/ai/shimmer';
import * as React from 'react';
import { View } from 'react-native';
import { StreamdownText } from 'react-native-streamdown';

type MessageResponseProps = {
  children: string;
  isStreaming?: boolean;
  className?: string;
};

const MessageResponse = React.memo(
  function MessageResponse({ children, isStreaming, className }: MessageResponseProps) {
    return (
      <View className={cn('flex-1', className)} collapsable={false}>
        {children.length > 0 ? (
          <StreamdownText markdown={children} />
        ) : isStreaming ? (
          <Shimmer>Thinking...</Shimmer>
        ) : null}
      </View>
    );
  },
  (prev, next) => prev.children === next.children && prev.isStreaming === next.isStreaming
);

MessageResponse.displayName = 'MessageResponse';

export { MessageResponse };
export type { MessageResponseProps };
