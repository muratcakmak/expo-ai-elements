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

type DrawerContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetRef: React.RefObject<BottomSheetModalRef | null>;
  // Tracks whether the modal is currently presented. Guards present()/dismiss()
  // so we never call dismiss() on a never-presented modal (which wedges gorhom
  // 5.x into a DISMISSING status and eats the next present()).
  presentedRef: React.RefObject<boolean>;
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
  const sheetRef = React.useRef<BottomSheetModalRef>(null);
  const presentedRef = React.useRef(false);
  const snapPoints = React.useMemo(() => snapPointsProp ?? ['50%', '90%'], [snapPointsProp]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Present / dismiss the modal to mirror the open state (controlled or not).
  // Guarded by presentedRef so we never dismiss() a modal that was never
  // presented (mount with open=false, or the render after each swipe/backdrop
  // dismissal) — that wedges gorhom 5.x into DISMISSING and skips the next
  // present(), killing every other open cycle.
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
    <DrawerContext.Provider
      value={{ open, onOpenChange: handleOpenChange, sheetRef, presentedRef }}
    >
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
  // Read the context here (still inside the page tree). BottomSheetModal
  // re-parents its children to the BottomSheetModalProvider host via
  // @gorhom/portal, so context provided below that host is lost — re-provide
  // it inside the modal for portaled children (e.g. DrawerClose).
  const ctx = useDrawerContext();
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
      snapPoints={snapPoints ?? ['50%', '90%']}
      enablePanDownToClose
      // gorhom v5 defaults enableDynamicSizing to true; with flex-1 content it
      // can inject a degenerate measured snap point and open as a sliver.
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onDismiss={() => {
        // Sync state back when dismissed via swipe-down or backdrop press.
        // Clear presentedRef so the open-mirroring effect can present() again.
        presentedRef.current = false;
        if (open) {
          onOpenChange(false);
        }
      }}
      handleIndicatorStyle={{
        backgroundColor: '#d1d5db',
        width: 100,
        height: 6,
        borderRadius: 3,
      }}
    >
      <DrawerContext.Provider value={ctx}>
        <BottomSheetView className={cn('flex-1', className)} {...props}>
          {children}
        </BottomSheetView>
      </DrawerContext.Provider>
    </BottomSheetModal>
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
