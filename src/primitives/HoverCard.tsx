import * as React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type HoverCardContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) {
    throw new Error('HoverCard compound components must be used within <HoverCard>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type HoverCardProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Delay in ms before opening after press (default 0) */
  openDelay?: number;
  /** Delay in ms before closing (default 0) */
  closeDelay?: number;
};

function HoverCard({
  children,
  open: controlledOpen,
  onOpenChange,
  openDelay = 0,
  closeDelay = 0,
}: HoverCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const openTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      // Clear any pending timers
      if (openTimeout.current) {
        clearTimeout(openTimeout.current);
        openTimeout.current = null;
      }
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }

      const apply = () => {
        if (!isControlled) {
          setInternalOpen(next);
        }
        onOpenChange?.(next);
      };

      const delay = next ? openDelay : closeDelay;
      if (delay > 0) {
        const ref = next ? openTimeout : closeTimeout;
        ref.current = setTimeout(apply, delay);
      } else {
        apply();
      }
    },
    [isControlled, onOpenChange, openDelay, closeDelay],
  );

  React.useEffect(() => {
    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <HoverCardContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <View className="relative">{children}</View>
    </HoverCardContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type HoverCardTriggerProps = PressableProps & {
  className?: string;
};

function HoverCardTrigger({ children, className, ...props }: HoverCardTriggerProps) {
  const { open, onOpenChange } = useHoverCardContext();

  const handlePress = React.useCallback(() => {
    onOpenChange(!open);
  }, [open, onOpenChange]);

  return (
    <Pressable
      className={cn(className)}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

/* --------------------------------- Content --------------------------------- */

type HoverCardContentProps = ViewProps & {
  className?: string;
};

function HoverCardContent({ children, className, ...props }: HoverCardContentProps) {
  const { open } = useHoverCardContext();

  if (!open) return null;

  return (
    <View
      
      
      className={cn(
        'absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-md border border-border bg-popover p-4 shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
