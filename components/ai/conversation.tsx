import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ArrowDownIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  FlatList,
  type FlatListProps,
  type ListRenderItem,
  View,
  type ViewProps,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';

// --- Conversation ---

type ConversationProps<T> = Omit<FlatListProps<T>, 'renderItem'> & {
  renderItem: ListRenderItem<T>;
  className?: string;
};

function Conversation<T>({
  data,
  renderItem,
  className,
  ...props
}: ConversationProps<T>) {
  const listRef = React.useRef<FlatList<T>>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback(() => {
    if (data && data.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [data]);

  // Auto-scroll when new data arrives and user is at bottom
  React.useEffect(() => {
    if (isAtBottom) {
      const timeout = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timeout);
    }
  }, [data?.length, isAtBottom, scrollToBottom]);

  const handleScroll = React.useCallback(
    (event: { nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } } }) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      setIsAtBottom(distanceFromBottom < 50);
    },
    []
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={cn('flex-1', className)}
    >
      <View className="flex-1">
        <FlatList
          ref={listRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerClassName="pb-4 pt-2"
          showsVerticalScrollIndicator={false}
          {...props}
        />
        {!isAtBottom && (
          <ConversationScrollButton onPress={scrollToBottom} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// --- ConversationScrollButton ---

type ConversationScrollButtonProps = {
  onPress: () => void;
  className?: string;
};

function ConversationScrollButton({ onPress, className }: ConversationScrollButtonProps) {
  return (
    <View className={cn('absolute bottom-4 self-center', className)}>
      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-full shadow-md"
        onPress={onPress}
      >
        <Icon as={ArrowDownIcon} className="text-muted-foreground size-4" />
      </Button>
    </View>
  );
}

// --- ConversationEmptyState ---

type ConversationEmptyStateProps = ViewProps & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

function ConversationEmptyState({
  title = 'Start a conversation',
  description = 'Send a message to begin.',
  icon,
  className,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <View
      className={cn('flex-1 items-center justify-center gap-4 p-8', className)}
      {...props}
    >
      {icon}
      <View className="items-center gap-2">
        <Text className="text-foreground text-lg font-semibold">{title}</Text>
        <Text className="text-muted-foreground text-center text-sm">{description}</Text>
      </View>
    </View>
  );
}

export {
  Conversation,
  ConversationScrollButton,
  ConversationEmptyState,
};
export type {
  ConversationProps,
  ConversationScrollButtonProps,
  ConversationEmptyStateProps,
};
