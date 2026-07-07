import * as React from 'react';
import { View, Text, Pressable, type ViewProps, type PressableProps } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type DropdownMenuContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetRef: React.RefObject<BottomSheet | null>;
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
  const sheetRef = React.useRef<BottomSheet>(null);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);

      if (next) {
        sheetRef.current?.expand();
      } else {
        sheetRef.current?.close();
      }
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: handleOpenChange, sheetRef }}>
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
  const { sheetRef, onOpenChange } = useDropdownMenuContext();

  const renderBackdrop = React.useCallback(
    (backdropProps: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints ?? ['40%']}
      enablePanDownToClose
      enableDynamicSizing={!snapPoints}
      backdropComponent={renderBackdrop}
      onClose={() => onOpenChange(false)}
    >
      <BottomSheetView className={cn('p-2', className)} {...props}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}

/* ---------------------------------- Item ----------------------------------- */

type DropdownMenuItemProps = PressableProps & {
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
        // Pressable's `children` may be a render fn; this menu item only ever
        // receives plain nodes, so render it directly as a node.
        (children as React.ReactNode)
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
