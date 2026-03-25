import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  type ViewProps,
  type TextProps,
  type PressableProps,
} from 'react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type TooltipContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) {
    throw new Error('Tooltip compound components must be used within <Tooltip>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type TooltipProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shorthand: rendered inside TooltipContent when using the simple API */
  content?: string;
};

function Tooltip({ children, open: controlledOpen, onOpenChange, content }: TooltipProps) {
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
    <TooltipContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <View className="relative">
        {children}
        {content != null && (
          <TooltipContent>
            <Text className="text-xs text-background">{content}</Text>
          </TooltipContent>
        )}
      </View>
    </TooltipContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type TooltipTriggerProps = PressableProps & {
  className?: string;
};

function TooltipTrigger({ children, className, ...props }: TooltipTriggerProps) {
  const { open, onOpenChange } = useTooltipContext();
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLongPress = React.useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  const handlePressOut = React.useCallback(() => {
    timeout.current = setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  }, [onOpenChange]);

  React.useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <Pressable
      className={cn(className)}
      onLongPress={handleLongPress}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

/* --------------------------------- Content --------------------------------- */

type TooltipContentProps = ViewProps & {
  className?: string;
};

function TooltipContent({ children, className, ...props }: TooltipContentProps) {
  const { open } = useTooltipContext();

  if (!open) return null;

  return (
      <View
        
        
        className={cn(
          'absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md bg-foreground px-3 py-1.5',
          className,
        )}
        {...props}
      >
        {children}
      </View>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
