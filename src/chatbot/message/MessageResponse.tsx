import React, { memo } from 'react';
import { type ViewProps } from 'react-native';
import { StreamdownText, type StreamdownTextProps } from 'react-native-streamdown';

import { cn } from '../../utils/cn';

export type MessageResponseProps = StreamdownTextProps & {
  className?: string;
};

const streamdownPlugins = ['cjk', 'code', 'math', 'mermaid'] as const;

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <StreamdownText
      className={cn('w-full', className)}
      plugins={[...streamdownPlugins]}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isAnimating === nextProps.isAnimating,
);

MessageResponse.displayName = 'MessageResponse';
