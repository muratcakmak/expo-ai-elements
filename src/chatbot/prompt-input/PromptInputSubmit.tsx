import type { ChatStatus } from 'ai';
import { ArrowUp, Square, X } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { Spinner } from '../../primitives/Spinner';
import { cn } from '../../utils/cn';
import { usePromptInputSubmit } from './PromptInput';

// ============================================================================
// PromptInputSubmit
// ============================================================================

export type PromptInputSubmitProps = PressableProps & {
  className?: string;
  /** Current chat status from the AI SDK */
  status?: ChatStatus;
  /** Called when user taps stop during streaming */
  onStop?: () => void;
  /** Icon size in pixels. Default: 16 */
  iconSize?: number;
  /** Icon color. Default: inherits from text color */
  iconColor?: string;
  children?: React.ReactNode;
};

export const PromptInputSubmit = ({
  className,
  status,
  onStop,
  onPress: onPressProp,
  iconSize = 16,
  iconColor,
  children,
  disabled,
  ...props
}: PromptInputSubmitProps) => {
  const submit = usePromptInputSubmit();
  const isGenerating = status === 'submitted' || status === 'streaming';

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (isGenerating && onStop) {
        onStop();
        return;
      }
      onPressProp?.(e);
      submit();
    },
    [isGenerating, onStop, onPressProp, submit],
  );

  let icon: React.ReactNode;
  if (status === 'submitted') {
    icon = <Spinner size="small" />;
  } else if (status === 'streaming') {
    icon = <Square size={iconSize} color={iconColor} />;
  } else if (status === 'error') {
    icon = <X size={iconSize} color={iconColor} />;
  } else {
    icon = <ArrowUp size={iconSize} color={iconColor} />;
  }

  return (
    <Pressable
      accessibilityLabel={isGenerating ? 'Stop' : 'Submit'}
      accessibilityRole="button"
      className={cn(
        'items-center justify-center rounded-full bg-primary p-2',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      {children ?? icon}
    </Pressable>
  );
};
