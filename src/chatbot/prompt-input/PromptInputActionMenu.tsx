import { ImageIcon, Monitor, Plus } from 'lucide-react-native';
import { useCallback } from 'react';
import { type PressableProps } from 'react-native';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../primitives/DropdownMenu';
import { cn } from '../../utils/cn';
import { usePromptInputAttachments } from './PromptInput';
import { pickDocuments, pickImages } from './PromptInputAttachments';

// ============================================================================
// PromptInputActionMenu — wraps DropdownMenu
// ============================================================================

export type PromptInputActionMenuProps = React.ComponentProps<
  typeof DropdownMenu
>;

export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
);

// ============================================================================
// PromptInputActionMenuTrigger
// ============================================================================

export type PromptInputActionMenuTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  /** Icon size. Default: 16 */
  iconSize?: number;
};

export const PromptInputActionMenuTrigger = ({
  className,
  children,
  iconSize = 16,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger
    className={cn('items-center justify-center p-2', className)}
    {...props}
  >
    {children ?? <Plus size={iconSize} className="text-muted-foreground" />}
  </DropdownMenuTrigger>
);

// ============================================================================
// PromptInputActionMenuContent
// ============================================================================

export type PromptInputActionMenuContentProps = React.ComponentProps<
  typeof DropdownMenuContent
>;

export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent className={cn(className)} {...props} />
);

// ============================================================================
// PromptInputActionMenuItem
// ============================================================================

export type PromptInputActionMenuItemProps = React.ComponentProps<
  typeof DropdownMenuItem
>;

export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={cn(className)} {...props} />
);

// ============================================================================
// PromptInputActionAddAttachments — opens document picker
// ============================================================================

// Omit children: forwarded into DropdownMenuItem (plain-node children only).
export type PromptInputActionAddAttachmentsProps = Omit<PressableProps, 'children'> & {
  className?: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  iconSize?: number;
};

export const PromptInputActionAddAttachments = ({
  label = 'Add photos or files',
  accept,
  multiple,
  iconSize = 16,
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments();

  const handlePress = useCallback(async () => {
    try {
      const files = await pickDocuments({ accept, multiple });
      if (files.length > 0) {
        attachments.add(files);
      }
    } catch {
      // User cancelled or error — silently ignore
    }
  }, [attachments, accept, multiple]);

  return (
    <DropdownMenuItem
      {...props}
      onPress={handlePress}
      icon={
        <ImageIcon size={iconSize} className="text-muted-foreground" />
      }
      label={label}
    />
  );
};

// ============================================================================
// PromptInputActionAddScreenshot — uses expo-screen-capture
// ============================================================================

export type PromptInputActionAddScreenshotProps = Omit<PressableProps, 'children'> & {
  className?: string;
  label?: string;
  iconSize?: number;
};

/**
 * Opens the device image picker (camera roll) as a proxy for "screenshot"
 * on native. True screen capture requires native modules and permission flows.
 *
 * For real screenshot functionality, integrate expo-screen-capture manually.
 */
export const PromptInputActionAddScreenshot = ({
  label = 'Add from camera roll',
  iconSize = 16,
  ...props
}: PromptInputActionAddScreenshotProps) => {
  const attachments = usePromptInputAttachments();

  const handlePress = useCallback(async () => {
    try {
      const files = await pickImages({ multiple: false });
      if (files.length > 0) {
        attachments.add(files);
      }
    } catch {
      // User cancelled or error — silently ignore
    }
  }, [attachments]);

  return (
    <DropdownMenuItem
      {...props}
      onPress={handlePress}
      icon={
        <Monitor size={iconSize} className="text-muted-foreground" />
      }
      label={label}
    />
  );
};
