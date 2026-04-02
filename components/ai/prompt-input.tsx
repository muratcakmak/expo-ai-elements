import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ArrowUpIcon, SquareIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, TextInput, View, type ViewProps } from 'react-native';

// --- Context ---

type PromptInputContextValue = {
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
};

const PromptInputContext = React.createContext<PromptInputContextValue>({
  value: '',
  setValue: () => {},
  isLoading: false,
});

function usePromptInput() {
  return React.useContext(PromptInputContext);
}

// --- PromptInput ---

type PromptInputProps = ViewProps & {
  value?: string;
  onValueChange?: (value: string) => void;
  isLoading?: boolean;
  onSubmit?: (message: string) => void;
  onStop?: () => void;
  children?: React.ReactNode;
};

function PromptInput({
  value: controlledValue,
  onValueChange,
  isLoading = false,
  onSubmit,
  onStop,
  className,
  children,
  ...props
}: PromptInputProps) {
  const [internalValue, setInternalValue] = React.useState('');
  const value = controlledValue ?? internalValue;
  const setValue = React.useCallback(
    (v: string) => {
      if (onValueChange) onValueChange(v);
      else setInternalValue(v);
    },
    [onValueChange]
  );

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit?.(trimmed);
    setValue('');
  }, [value, isLoading, onSubmit, setValue]);

  const contextValue = React.useMemo(
    () => ({ value, setValue, isLoading }),
    [value, setValue, isLoading]
  );

  return (
    <PromptInputContext.Provider value={contextValue}>
      <View
        className={cn(
          'border-border bg-background flex-row items-end gap-2 border-t px-4 py-3',
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <PromptInputTextarea
              onSubmitEditing={handleSubmit}
              placeholder="Send a message..."
            />
            {isLoading ? (
              <PromptInputStopButton onPress={onStop} />
            ) : (
              <PromptInputSendButton onPress={handleSubmit} />
            )}
          </>
        )}
      </View>
    </PromptInputContext.Provider>
  );
}

// --- PromptInputTextarea ---

type PromptInputTextareaProps = React.ComponentProps<typeof TextInput> & {
  maxHeight?: number;
};

function PromptInputTextarea({
  className,
  maxHeight = 120,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue } = usePromptInput();

  return (
    <TextInput
      className={cn(
        'text-foreground placeholder:text-muted-foreground bg-secondary flex-1 rounded-2xl px-4 py-2.5 text-sm',
        className
      )}
      value={value}
      onChangeText={setValue}
      multiline
      textAlignVertical="top"
      style={{ maxHeight }}
      placeholderTextColor={undefined}
      returnKeyType={Platform.OS === 'ios' ? 'default' : 'send'}
      blurOnSubmit={false}
      {...props}
    />
  );
}

// --- PromptInputSendButton ---

type PromptInputButtonProps = {
  onPress?: () => void;
  className?: string;
};

function PromptInputSendButton({ onPress, className }: PromptInputButtonProps) {
  const { value } = usePromptInput();
  const disabled = !value.trim();

  return (
    <Button
      size="icon"
      className={cn('size-10 rounded-full', className)}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon as={ArrowUpIcon} className="text-primary-foreground size-5" />
    </Button>
  );
}

// --- PromptInputStopButton ---

function PromptInputStopButton({ onPress, className }: PromptInputButtonProps) {
  return (
    <Button
      size="icon"
      variant="destructive"
      className={cn('size-10 rounded-full', className)}
      onPress={onPress}
    >
      <Icon as={SquareIcon} className="size-4 text-white" />
    </Button>
  );
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputSendButton,
  PromptInputStopButton,
  PromptInputContext,
  usePromptInput,
};
export type { PromptInputProps, PromptInputTextareaProps, PromptInputButtonProps };
