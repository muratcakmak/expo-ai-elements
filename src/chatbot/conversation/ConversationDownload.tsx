import React, { useCallback } from 'react';
import { Download } from 'lucide-react-native';
import type { UIMessage } from 'ai';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import { messagesToMarkdown } from '../../utils/messagesToMarkdown';

export type ConversationDownloadProps = Omit<ButtonProps, 'onPress'> & {
  className?: string;
  messages: UIMessage[];
  filename?: string;
  formatMessage?: (message: UIMessage, index: number) => string;
};

export const ConversationDownload = ({
  messages,
  filename = 'conversation.md',
  formatMessage,
  className,
  children,
  ...props
}: ConversationDownloadProps) => {
  const handlePress = useCallback(async () => {
    try {
      const FileSystem = await import('expo-file-system/legacy');
      const Sharing = await import('expo-sharing');

      const markdown = messagesToMarkdown(messages, formatMessage);
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, markdown, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/markdown',
          dialogTitle: 'Share conversation',
          UTI: 'net.daringfireball.markdown',
        });
      }
    } catch (error) {
      console.warn('ConversationDownload: failed to share', error);
    }
  }, [messages, filename, formatMessage]);

  return (
    <Button
      variant="outline"
      size="icon"
      onPress={handlePress}
      className={cn('absolute right-4 top-4 rounded-full', className)}
      {...props}
    >
      {children ?? <Download size={16} className="text-foreground" />}
    </Button>
  );
};
