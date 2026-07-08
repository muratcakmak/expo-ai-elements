import * as React from 'react';
import { View, Text, Pressable, type ViewProps, type PressableProps } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type BottomSheetModalRef = React.ComponentRef<typeof BottomSheetModal>;

type DropdownMenuContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetRef: React.RefObject<BottomSheetModalRef | null>;
  // Tracks whether the modal is currently presented. Guards present()/dismiss()
  // so we never call dismiss() on a never-presented modal (which wedges gorhom
  // 5.x into a DISMISSING status and eats the next present()).
  presentedRef: React.RefObject<boolean>;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) {
    throw new Error('DropdownMenu compound components must be used within <DropdownMenu>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type DropdownMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const sheetRef = React.useRef<BottomSheetModalRef>(null);
  const presentedRef = React.useRef(false);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Present / dismiss the modal to mirror the open state. Guarded by
  // presentedRef so we never dismiss() a modal that was never presented
  // (mount with open=false, or the render after each swipe/backdrop dismissal)
  // — that wedges gorhom 5.x into DISMISSING and skips the next present(),
  // killing every other open cycle.
  React.useEffect(() => {
    if (open && !presentedRef.current) {
      presentedRef.current = true;
      sheetRef.current?.present();
    } else if (!open && presentedRef.current) {
      presentedRef.current = false;
      sheetRef.current?.dismiss();
    }
  }, [open]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, onOpenChange: handleOpenChange, sheetRef, presentedRef }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type DropdownMenuTriggerProps = PressableProps & {
  className?: string;
};

function DropdownMenuTrigger({ children, className, ...props }: DropdownMenuTriggerProps) {
  const { open, onOpenChange } = useDropdownMenuContext();

  return (
    <Pressable
      className={cn(className)}
      onPress={() => onOpenChange(!open)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

/* --------------------------------- Content --------------------------------- */

type DropdownMenuContentProps = ViewProps & {
  className?: string;
  snapPoints?: (string | number)[];
};

function DropdownMenuContent({
  children,
  className,
  snapPoints,
  ...props
}: DropdownMenuContentProps) {
  // Read the context here (still inside the page tree). BottomSheetModal
  // re-parents its children to the BottomSheetModalProvider host via
  // @gorhom/portal, so context provided below that host is lost — re-provide
  // it inside the modal for any context-consuming children.
  const ctx = useDropdownMenuContext();
  const { sheetRef, open, onOpenChange, presentedRef } = ctx;

  const renderBackdrop = React.useCallback(
    (backdropProps: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints ?? ['40%']}
      enablePanDownToClose
      enableDynamicSizing={!snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={() => {
        // Sync state back when dismissed via swipe-down or backdrop press.
        // Clear presentedRef so the open-mirroring effect can present() again.
        presentedRef.current = false;
        if (open) {
          onOpenChange(false);
        }
      }}
    >
      <DropdownMenuContext.Provider value={ctx}>
        <BottomSheetView className={cn('p-2', className)} {...props}>
          {children}
        </BottomSheetView>
      </DropdownMenuContext.Provider>
    </BottomSheetModal>
  );
}

/* ---------------------------------- Item ----------------------------------- */

// Override PressableProps' `children` (which allows a render fn `(state) =>
// ReactNode`) with a plain node — this menu item renders children directly, so
// a function child would throw at runtime.
type DropdownMenuItemProps = Omit<PressableProps, 'children'> & {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  variant?: 'default' | 'destructive';
  // Align with PressableProps (RN 0.86 widened `disabled` to `boolean | null`).
  disabled?: boolean | null;
};

function DropdownMenuItem({
  children,
  className,
  icon,
  label,
  variant = 'default',
  disabled,
  ...props
}: DropdownMenuItemProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-2 rounded-sm px-2 py-2.5',
        variant === 'destructive' && 'text-destructive',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      accessibilityRole="menuitem"
      {...props}
    >
      {icon}
      {label ? (
        <Text
          className={cn(
            'text-sm text-foreground',
            variant === 'destructive' && 'text-destructive',
          )}
        >
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

/* ------------------------------- Separator --------------------------------- */

type DropdownMenuSeparatorProps = ViewProps & {
  className?: string;
};

function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return <View className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

/* --------------------------------- Label ----------------------------------- */

type DropdownMenuLabelProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function DropdownMenuLabel({ children, className, ...props }: DropdownMenuLabelProps) {
  return (
    <View className={cn('px-2 py-1.5', className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-sm font-medium text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* --------------------------------- Group ----------------------------------- */

type DropdownMenuGroupProps = ViewProps & {
  className?: string;
};

function DropdownMenuGroup({ children, className, ...props }: DropdownMenuGroupProps) {
  return (
    <View className={cn(className)} accessibilityRole="menu" {...props}>
      {children}
    </View>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
};
