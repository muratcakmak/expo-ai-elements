import { cn } from '@/lib/utils';
import { Shimmer } from '@/components/ai/shimmer';
import * as React from 'react';
import { View } from 'react-native';
import {
  EnrichedMarkdownText,
  type MarkdownStyle,
} from 'react-native-enriched-markdown';
import { useUniwind } from 'uniwind';

const DARK_MARKDOWN_STYLE: MarkdownStyle = {
  paragraph: { color: '#fafafa' },
  h1: { color: '#fafafa' },
  h2: { color: '#fafafa' },
  h3: { color: '#fafafa' },
  h4: { color: '#fafafa' },
  h5: { color: '#fafafa' },
  h6: { color: '#fafafa' },
  strong: { color: '#fafafa' },
  em: { color: '#fafafa' },
  link: { color: '#93c5fd' },
  code: { color: '#e2e8f0', backgroundColor: '#1e293b', borderColor: '#334155' },
  codeBlock: { color: '#e2e8f0', backgroundColor: '#0f172a', borderColor: '#1e293b' },
  blockquote: { color: '#a1a1aa', borderColor: '#3f3f46' },
  list: { color: '#fafafa', bulletColor: '#a1a1aa', markerColor: '#a1a1aa' },
  math: { color: '#fafafa', backgroundColor: '#18181b' },
  inlineMath: { color: '#fafafa' },
  thematicBreak: { color: '#3f3f46' },
  table: {
    color: '#fafafa',
    borderColor: '#3f3f46',
    headerBackgroundColor: '#1e293b',
    headerTextColor: '#fafafa',
    rowEvenBackgroundColor: '#18181b',
    rowOddBackgroundColor: '#0f172a',
  },
};

type MessageResponseProps = {
  children: string;
  isStreaming?: boolean;
  className?: string;
};

const MessageResponse = React.memo(
  function MessageResponse({ children, isStreaming, className }: MessageResponseProps) {
    const { theme } = useUniwind();
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

    return (
      <View className={cn('flex-1', className)} collapsable={false}>
        {displayText.length > 0 ? (
          <EnrichedMarkdownText
            markdown={displayText}
            flavor="github"
            markdownStyle={theme === 'dark' ? DARK_MARKDOWN_STYLE : undefined}
          />
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
