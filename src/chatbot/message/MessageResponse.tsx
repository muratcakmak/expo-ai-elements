import React, { memo } from 'react';
import { StreamdownText, type StreamdownTextProps } from 'react-native-streamdown';

import { cn } from '../../utils/cn';

export type MessageResponseProps = StreamdownTextProps & {
  className?: string;
};

/**
 * Renders streamed assistant markdown via react-native-streamdown 0.2.0.
 *
 * The 0.2.0 API takes the raw markdown string through the `markdown` prop
 * (there is no `children` / `plugins` API anymore — extended markdown
 * features are handled natively by react-native-enriched-markdown, and
 * streaming smoothing is opt-in via `streamingAnimation`).
 */
export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <StreamdownText className={cn('w-full', className)} {...props} />
  ),
);

MessageResponse.displayName = 'MessageResponse';
