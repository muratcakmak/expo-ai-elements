import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

type MessageRole = 'user' | 'assistant' | 'system';

type MessageContextValue = {
  role: MessageRole;
};

const MessageContext = React.createContext<MessageContextValue>({ role: 'assistant' });

function useMessageContext() {
  return React.useContext(MessageContext);
}

// --- Message ---

type MessageProps = Omit<ViewProps, 'role'> & {
  role: MessageRole;
};

function Message({ role, className, children, ...props }: MessageProps) {
  const contextValue = React.useMemo(() => ({ role }), [role]);

  return (
    <MessageContext.Provider value={contextValue}>
      <View
        className={cn(
          'flex-row gap-3 px-4 py-2',
          role === 'user' && 'flex-row-reverse',
          role === 'system' && 'justify-center',
          className
        )}
        {...props}
      >
        {children}
      </View>
    </MessageContext.Provider>
  );
}

// --- MessageContent ---

type MessageContentProps = ViewProps;

function MessageContent({ className, children, ...props }: MessageContentProps) {
  const { role } = useMessageContext();

  return (
    <View
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3',
        role === 'user' && 'bg-primary rounded-tr-sm',
        role === 'assistant' && 'rounded-tl-sm',
        role === 'system' && 'bg-muted max-w-[95%] rounded-lg px-3 py-2',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

// --- MessageActions ---

type MessageActionsProps = ViewProps;

function MessageActions({ className, children, ...props }: MessageActionsProps) {
  const { role } = useMessageContext();

  return (
    <View
      className={cn(
        'flex-row items-center gap-1 px-1 pt-1',
        role === 'user' && 'flex-row-reverse',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

// --- MessageText (convenience for simple text messages) ---

type MessageTextProps = {
  className?: string;
  children: string;
};

function MessageText({ className, children }: MessageTextProps) {
  const { role } = useMessageContext();

  return (
    <Text
      className={cn(
        'text-sm',
        role === 'user' && 'text-primary-foreground',
        role === 'assistant' && 'text-foreground',
        role === 'system' && 'text-muted-foreground text-center text-xs',
        className
      )}
    >
      {children}
    </Text>
  );
}

export { Message, MessageContent, MessageActions, MessageText, MessageContext, useMessageContext };
export type { MessageProps, MessageContentProps, MessageActionsProps, MessageTextProps, MessageRole };
