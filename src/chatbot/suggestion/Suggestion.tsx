import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { Button, type ButtonProps } from '../../primitives/Button';
import { ScrollArea } from '../../primitives/ScrollArea';

/* -------------------------------- Suggestions ------------------------------ */

export type SuggestionsProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
};

export const Suggestions = ({
  className,
  children,
  style,
  ...props
}: SuggestionsProps) => (
  <ScrollArea horizontal style={{ width: '100%' }} {...props}>
    <View style={[suggestionsStyles.container, style]}>
      {children}
    </View>
  </ScrollArea>
);

const suggestionsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

/* -------------------------------- Suggestion ------------------------------- */

export type SuggestionProps = Omit<ButtonProps, 'onPress'> & {
  suggestion: string;
  onPress?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onPress,
  className,
  variant = 'outline',
  size = 'sm',
  children,
  style,
  ...props
}: SuggestionProps) => {
  const handlePress = useCallback(() => {
    onPress?.(suggestion);
  }, [onPress, suggestion]);

  return (
    <Button
      style={[suggestionStyles.button, style as StyleProp<ViewStyle>]}
      onPress={handlePress}
      size={size}
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  );
};

const suggestionStyles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingHorizontal: 16,
  },
});
