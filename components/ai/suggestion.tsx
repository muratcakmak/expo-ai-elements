import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, type ViewProps, View } from 'react-native';

// --- Suggestions (horizontal scroll container) ---

type SuggestionsProps = ViewProps;

function Suggestions({ className, children, ...props }: SuggestionsProps) {
  return (
    <View className={cn('px-4 py-2', className)} {...props}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {children}
      </ScrollView>
    </View>
  );
}

// --- Suggestion (individual chip) ---

type SuggestionProps = {
  suggestion: string;
  onPress?: (suggestion: string) => void;
  className?: string;
};

function Suggestion({ suggestion, onPress, className }: SuggestionProps) {
  const handlePress = React.useCallback(() => {
    onPress?.(suggestion);
  }, [suggestion, onPress]);

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('rounded-full px-4', className)}
      onPress={handlePress}
    >
      <Text className="text-sm">{suggestion}</Text>
    </Button>
  );
}

export { Suggestions, Suggestion };
export type { SuggestionsProps, SuggestionProps };
