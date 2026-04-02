import { cn } from '@/lib/utils';
import { Shimmer } from '@/components/ai/shimmer';
import * as React from 'react';
import { View } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

type MessageResponseProps = {
  children: string;
  isStreaming?: boolean;
  className?: string;
};

const MessageResponse = React.memo(
  function MessageResponse({ children, isStreaming, className }: MessageResponseProps) {
    // Throttle updates during streaming to reduce layout jumps.
    // EnrichedMarkdownText recalculates native layout on every prop change.
    // Buffering to ~80ms intervals cuts re-renders significantly.
    const [displayText, setDisplayText] = React.useState(children);

    React.useEffect(() => {
      if (!isStreaming) {
        setDisplayText(children);
        return;
      }
      const timer = setTimeout(() => setDisplayText(children), 80);
      return () => clearTimeout(timer);
    }, [children, isStreaming]);

    // Use commonmark during streaming (single text view, no segment overlap).
    // Switch to github flavor when done (enables tables + block LaTeX).
    const flavor = isStreaming ? 'commonmark' : 'github';

    return (
      <View className={cn('flex-1', className)} collapsable={false}>
        {displayText.length > 0 ? (
          <EnrichedMarkdownText markdown={displayText} flavor={flavor} />
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
