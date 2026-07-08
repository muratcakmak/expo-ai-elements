import React, { useCallback } from 'react';
import { View } from 'react-native';
import { ArrowDown } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import { useStickToBottom } from './Conversation';

export type ConversationScrollButtonProps = Omit<ButtonProps, 'onPress'> & {
  className?: string;
};

export const ConversationScrollButton = ({
  className,
  children,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottom();

  const handlePress = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return !isAtBottom ? (
    <View
      
      
      className={cn(
        'absolute bottom-4 left-1/2 z-50 -translate-x-1/2',
        className,
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onPress={handlePress}
        className="rounded-full"
        {...props}
      >
        {children ?? <ArrowDown size={16} className="text-foreground" />}
      </Button>
    </View>
  ) : null;
};
