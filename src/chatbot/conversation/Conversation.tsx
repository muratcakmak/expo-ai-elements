import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  type ScrollViewProps,
  type ViewProps,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type LayoutChangeEvent,
} from 'react-native';

import { cn } from '../../utils/cn';

/* ----------------------------- useStickToBottom ----------------------------- */

type StickToBottomContextValue = {
  isAtBottom: boolean;
  scrollToBottom: () => void;
};

const StickToBottomContext =
  React.createContext<StickToBottomContextValue | null>(null);

export function useStickToBottom() {
  const ctx = React.useContext(StickToBottomContext);
  if (!ctx) {
    throw new Error(
      'useStickToBottom must be used within a Conversation component',
    );
  }
  return ctx;
}

/* ------------------------------- Conversation ------------------------------ */

export type ConversationProps = ScrollViewProps & {
  className?: string;
};

export const Conversation = ({
  className,
  children,
  onScroll: onScrollProp,
  ...props
}: ConversationProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const contentHeightRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);

  const BOTTOM_THRESHOLD = 40;

  const checkIsAtBottom = useCallback(() => {
    const maxOffset =
      contentHeightRef.current - scrollViewHeightRef.current;
    const atBottom =
      maxOffset <= 0 ||
      scrollOffsetRef.current >= maxOffset - BOTTOM_THRESHOLD;
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      checkIsAtBottom();
      onScrollProp?.(event);
    },
    [checkIsAtBottom, onScrollProp],
  );

  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      contentHeightRef.current = h;
      // Auto-scroll to bottom when new content arrives and we were at the bottom
      if (isAtBottom) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
      checkIsAtBottom();
    },
    [isAtBottom, checkIsAtBottom],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollViewHeightRef.current = event.nativeEvent.layout.height;
      checkIsAtBottom();
    },
    [checkIsAtBottom],
  );

  const contextValue = React.useMemo<StickToBottomContextValue>(
    () => ({ isAtBottom, scrollToBottom }),
    [isAtBottom, scrollToBottom],
  );

  return (
    <StickToBottomContext.Provider value={contextValue}>
      <ScrollView
        ref={scrollViewRef}
        className={cn('relative flex-1', className)}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        accessibilityRole="summary"
        {...props}
      >
        {children}
      </ScrollView>
    </StickToBottomContext.Provider>
  );
};

/* ----------------------------- ConversationContent ----------------------------- */

export type ConversationContentProps = ViewProps & {
  className?: string;
};

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <View className={cn('flex-col gap-8 p-4', className)} {...props} />
);

/* ----------------------------- ConversationEmptyState ----------------------------- */

export type ConversationEmptyStateProps = ViewProps & {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = 'No messages yet',
  description = 'Start a conversation to see messages here',
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <View
    className={cn(
      'flex flex-1 flex-col items-center justify-center gap-3 p-8',
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <View className="text-muted-foreground">{icon}</View>}
        <View className="items-center gap-1">
          <Text className="text-sm font-medium text-foreground">{title}</Text>
          {description ? (
            <Text className="text-center text-sm text-muted-foreground">
              {description}
            </Text>
          ) : null}
        </View>
      </>
    )}
  </View>
);
