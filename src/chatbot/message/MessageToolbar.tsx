import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

export type MessageToolbarProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
};

export const MessageToolbar = ({
  className,
  children,
  style,
  ...props
}: MessageToolbarProps) => (
  <View
    style={[styles.toolbar, style]}
    {...props}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  toolbar: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
});
