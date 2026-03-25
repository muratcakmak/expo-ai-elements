import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import type { UIMessage } from 'ai';

/* --------------------------------- Message --------------------------------- */

export type MessageProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
  from: UIMessage['role'];
};

export const Message = ({ className, from, style, ...props }: MessageProps) => (
  <View
    style={[
      styles.message,
      from === 'user' ? styles.messageUser : styles.messageAssistant,
      style,
    ]}
    {...props}
  />
);

/* ------------------------------ MessageContent ----------------------------- */

export type MessageContentProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
  from?: UIMessage['role'];
};

export const MessageContent = ({
  children,
  className,
  from,
  style,
  ...props
}: MessageContentProps) => (
  <View
    style={[
      contentStyles.base,
      from === 'user' && contentStyles.user,
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  message: {
    width: '100%',
    maxWidth: '95%',
    flexDirection: 'column',
    gap: 8,
  },
  messageUser: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  messageAssistant: {
    alignItems: 'flex-start',
  },
});

const contentStyles = StyleSheet.create({
  base: {
    minWidth: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  user: {
    marginLeft: 'auto',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
