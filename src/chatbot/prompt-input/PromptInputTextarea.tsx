import { useCallback, useState } from 'react';
import {
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type TextInputSubmitEditingEventData,
} from 'react-native';

import {
  InputGroupTextarea,
  type InputGroupTextareaProps,
} from '../../primitives/InputGroup';
import { cn } from '../../utils/cn';
import {
  usePromptInputAttachments,
  usePromptInputSubmit,
} from './PromptInput';

// ============================================================================
// Re-export the underlying textarea props so consumers can extend
// ============================================================================

type PromptInputTextareaBaseProps = Omit<InputGroupTextareaProps, 'className'>;

export type PromptInputTextareaProps = PromptInputTextareaBaseProps & {
  className?: string;
  /** When true, pressing Return on the software keyboard triggers submit. Default: true */
  submitOnEnter?: boolean;
};

/**
 * PromptInputTextarea
 *
 * A multiline TextInput that auto-grows, syncs with the PromptInput text state
 * (via an optional PromptInputProvider), and can trigger form submission on
 * Enter (when `submitOnEnter` is true).
 */
export const PromptInputTextarea = ({
  className,
  placeholder = 'What would you like to know?',
  submitOnEnter = true,
  onChangeText: onChangeTextProp,
  onKeyPress: onKeyPressProp,
  onSubmitEditing: onSubmitEditingProp,
  ...props
}: PromptInputTextareaProps) => {
  const attachments = usePromptInputAttachments();
  const submit = usePromptInputSubmit();

  // Local text state — managed by the textarea itself unless a provider overrides
  const [localValue, setLocalValue] = useState('');

  // Check if we have a provider-level controller by trying to import it
  // We use the attachments context as a proxy — if it exists, the PromptInput is mounted
  const value = props.value ?? localValue;

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      onChangeTextProp?.(text);
    },
    [onChangeTextProp],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      onKeyPressProp?.(e);

      // Remove last attachment when Backspace is pressed and textarea is empty
      if (
        e.nativeEvent.key === 'Backspace' &&
        value === '' &&
        attachments.files.length > 0
      ) {
        const lastAttachment = attachments.files.at(-1);
        if (lastAttachment) {
          attachments.remove(lastAttachment.id);
        }
      }
    },
    [onKeyPressProp, value, attachments],
  );

  const handleSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitEditingProp?.(e);

      if (submitOnEnter) {
        submit();
      }
    },
    [onSubmitEditingProp, submitOnEnter, submit],
  );

  return (
    <InputGroupTextarea
      className={cn('min-h-[64px] max-h-48', className)}
      placeholder={placeholder}
      value={value}
      onChangeText={handleChangeText}
      onKeyPress={handleKeyPress}
      onSubmitEditing={handleSubmitEditing}
      returnKeyType={submitOnEnter ? 'send' : 'default'}
      blurOnSubmit={false}
      {...props}
    />
  );
};
