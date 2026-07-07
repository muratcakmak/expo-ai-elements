import * as React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { ChevronDownIcon } from 'lucide-react-native';

import { cn } from '../utils/cn';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

/* ---------------------------------- Context --------------------------------- */

type AccordionType = 'single' | 'multiple';

type AccordionContextValue = {
  type: AccordionType;
  expandedItems: string[];
  toggleItem: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion compound components must be used within <Accordion>');
  }
  return ctx;
}

/* ---- Item context ---- */

type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error('AccordionTrigger/AccordionContent must be used within <AccordionItem>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type AccordionProps = ViewProps & {
  className?: string;
  type?: AccordionType;
  /** Controlled value — string for single, string[] for multiple */
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
};

function Accordion({
  children,
  className,
  type = 'single',
  value: controlledValue,
  onValueChange,
  defaultValue,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isControlled = controlledValue !== undefined;
  const expandedItems = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : internalValue;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let next: string[];

      if (type === 'single') {
        next = expandedItems.includes(itemValue) ? [] : [itemValue];
      } else {
        next = expandedItems.includes(itemValue)
          ? expandedItems.filter((v) => v !== itemValue)
          : [...expandedItems, itemValue];
      }

      if (!isControlled) {
        setInternalValue(next);
      }

      if (onValueChange) {
        onValueChange(type === 'single' ? (next[0] ?? '') : next);
      }
    },
    [type, expandedItems, isControlled, onValueChange],
  );

  return (
    <AccordionContext.Provider value={{ type, expandedItems, toggleItem }}>
      <View className={cn(className)} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

/* ---------------------------------- Item ----------------------------------- */

type AccordionItemProps = ViewProps & {
  className?: string;
  value: string;
};

function AccordionItem({ children, className, value, ...props }: AccordionItemProps) {
  const { expandedItems, toggleItem } = useAccordionContext();
  const isOpen = expandedItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <Collapsible
        open={isOpen}
        onOpenChange={() => toggleItem(value)}
        className={cn('border-b border-border last:border-b-0', className)}
        {...props}
      >
        {children}
      </Collapsible>
    </AccordionItemContext.Provider>
  );
}

/* --------------------------------- Trigger --------------------------------- */

type AccordionTriggerProps = PressableProps & {
  className?: string;
  // Narrow the Pressable render-prop `children` union to a plain node.
  children?: React.ReactNode;
};

function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const { isOpen } = useAccordionItemContext();

  return (
    <CollapsibleTrigger
      className={cn(
        'flex-row flex-1 items-center justify-between gap-4 py-4',
        className,
      )}
      {...props}
    >
      {children}
      <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
        <ChevronDownIcon size={16} className="text-muted-foreground" />
      </View>
    </CollapsibleTrigger>
  );
}

/* --------------------------------- Content --------------------------------- */

type AccordionContentProps = ViewProps & {
  className?: string;
};

function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  return (
    <CollapsibleContent className={cn('pb-4', className)} {...props}>
      {children}
    </CollapsibleContent>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
