import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  type ViewProps,
  type PressableProps,
} from 'react-native';
import { XIcon } from 'lucide-react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog compound components must be used within <Dialog>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type DialogProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type DialogTriggerProps = PressableProps & {
  className?: string;
};

function DialogTrigger({ children, className, ...props }: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext();

  return (
    <Pressable
      className={cn(className)}
      onPress={() => onOpenChange(true)}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </Pressable>
  );
}

/* --------------------------------- Content --------------------------------- */

type DialogContentProps = ViewProps & {
  className?: string;
  showCloseButton?: boolean;
};

function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const { open, onOpenChange } = useDialogContext();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={() => onOpenChange(false)}
        accessibilityRole="none"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <View
            
            className={cn(
              'w-[90%] max-w-lg gap-4 rounded-lg border border-border bg-background p-6 shadow-lg',
              className,
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <Pressable
                className="absolute right-4 top-4 rounded-sm opacity-70"
                onPress={() => onOpenChange(false)}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <XIcon size={16} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* --------------------------------- Header ---------------------------------- */

type DialogHeaderProps = ViewProps & {
  className?: string;
};

function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <View className={cn('flex-col gap-2', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Title ---------------------------------- */

type DialogTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <View className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-lg font-semibold leading-none text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* ------------------------------ Description -------------------------------- */

type DialogDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  return (
    <View className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* --------------------------------- Footer ---------------------------------- */

type DialogFooterProps = ViewProps & {
  className?: string;
};

function DialogFooter({ children, className, ...props }: DialogFooterProps) {
  return (
    <View className={cn('flex-row justify-end gap-2', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Close ---------------------------------- */

type DialogCloseProps = PressableProps & {
  className?: string;
};

function DialogClose({ children, className, ...props }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  return (
    <Pressable
      className={cn(className)}
      onPress={() => onOpenChange(false)}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </Pressable>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
