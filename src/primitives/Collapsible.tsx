import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

/* --------------------------------- Context -------------------------------- */

type CollapsibleContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(): CollapsibleContextValue {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      'Collapsible compound components must be rendered within a <Collapsible> root.',
    );
  }
  return context;
}

/* ---------------------------------- Root ---------------------------------- */

type CollapsibleProps = ViewProps & {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

function Collapsible({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      controlledOnOpenChange?.(nextOpen);
    },
    [isControlled, controlledOnOpenChange],
  );

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <View className={cn(className)} {...props}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

/* -------------------------------- Trigger -------------------------------- */

type CollapsibleTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const { open, onOpenChange } = useCollapsible();

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

/* -------------------------------- Content -------------------------------- */

type CollapsibleContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsibleContentProps) {
  const { open } = useCollapsible();

  if (!open) return null;

  return (
    <View
      
      
      style={{ overflow: 'hidden' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </View>
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
};
