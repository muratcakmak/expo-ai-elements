import * as React from 'react';
import { View, Text, Pressable, type ViewProps, type PressableProps } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type DrawerContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetRef: React.RefObject<BottomSheet | null>;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) {
    throw new Error('Drawer compound components must be used within <Drawer>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type DrawerProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  snapPoints?: (string | number)[];
};

function Drawer({
  children,
  open: controlledOpen,
  onOpenChange,
  snapPoints: snapPointsProp,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => snapPointsProp ?? ['50%', '90%'], [snapPointsProp]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);

      if (next) {
        sheetRef.current?.snapToIndex(0);
      } else {
        sheetRef.current?.close();
      }
    },
    [isControlled, onOpenChange],
  );

  // Sync external controlled state
  React.useEffect(() => {
    if (isControlled) {
      if (controlledOpen) {
        sheetRef.current?.snapToIndex(0);
      } else {
        sheetRef.current?.close();
      }
    }
  }, [controlledOpen, isControlled]);

  return (
    <DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange, sheetRef }}>
      {/* Render non-sheet children directly */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DrawerContent) {
          return null;
        }
        return child;
      })}
      {/* Render DrawerContent (BottomSheet) at the end */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DrawerContent) {
          return React.cloneElement(child as React.ReactElement<DrawerContentProps>, {
            snapPoints,
          });
        }
        return null;
      })}
    </DrawerContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type DrawerTriggerProps = PressableProps & {
  className?: string;
};

function DrawerTrigger({ children, className, ...props }: DrawerTriggerProps) {
  const { open, onOpenChange } = useDrawerContext();

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

type DrawerContentProps = ViewProps & {
  className?: string;
  snapPoints?: (string | number)[];
};

function DrawerContent({ children, className, snapPoints, ...props }: DrawerContentProps) {
  const { sheetRef, onOpenChange } = useDrawerContext();

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
      snapPoints={snapPoints ?? ['50%', '90%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={() => onOpenChange(false)}
      handleIndicatorStyle={{
        backgroundColor: '#d1d5db',
        width: 100,
        height: 6,
        borderRadius: 3,
      }}
    >
      <BottomSheetView className={cn('flex-1', className)} {...props}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}

/* --------------------------------- Header ---------------------------------- */

type DrawerHeaderProps = ViewProps & {
  className?: string;
};

function DrawerHeader({ children, className, ...props }: DrawerHeaderProps) {
  return (
    <View className={cn('flex-col gap-1 p-4', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Title ---------------------------------- */

type DrawerTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function DrawerTitle({ children, className, ...props }: DrawerTitleProps) {
  return (
    <View className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="font-semibold text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* ------------------------------ Description -------------------------------- */

type DrawerDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function DrawerDescription({ children, className, ...props }: DrawerDescriptionProps) {
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

type DrawerFooterProps = ViewProps & {
  className?: string;
};

function DrawerFooter({ children, className, ...props }: DrawerFooterProps) {
  return (
    <View className={cn('mt-auto flex-col gap-2 p-4', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Close ---------------------------------- */

type DrawerCloseProps = PressableProps & {
  className?: string;
};

function DrawerClose({ children, className, ...props }: DrawerCloseProps) {
  const { onOpenChange } = useDrawerContext();

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
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
};
