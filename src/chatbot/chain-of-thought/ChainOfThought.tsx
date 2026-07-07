import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { BrainIcon, ChevronDownIcon, DotIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Badge, type BadgeProps } from '../../primitives/Badge';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* --------------------------------- Context -------------------------------- */

interface ChainOfThoughtContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      'ChainOfThought components must be used within ChainOfThought',
    );
  }
  return context;
};

/* ----------------------------- ChainOfThought ----------------------------- */

export type ChainOfThoughtProps = ViewProps & {
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ChainOfThought = memo(
  ({
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
    ...props
  }: ChainOfThoughtProps) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const setIsOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const chainOfThoughtContext = useMemo(
      () => ({ isOpen, setIsOpen }),
      [isOpen, setIsOpen],
    );

    return (
      <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
        <View className={cn('w-full gap-4', className)} {...props}>
          {children}
        </View>
      </ChainOfThoughtContext.Provider>
    );
  },
);

/* ------------------------- ChainOfThoughtHeader -------------------------- */

export type ChainOfThoughtHeaderProps = ViewProps & {
  className?: string;
  children?: ReactNode;
};

export const ChainOfThoughtHeader = memo(
  ({ className, children, ...props }: ChainOfThoughtHeaderProps) => {
    const { isOpen, setIsOpen } = useChainOfThought();

    return (
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <CollapsibleTrigger
          className={cn(
            'flex-row w-full items-center gap-2',
            className,
          )}
          {...props}
        >
          <BrainIcon size={16} className="text-muted-foreground" />
          <View className="flex-1">
            {children ? (
              typeof children === 'string' ? (
                <Text className="text-sm text-muted-foreground text-left">{children}</Text>
              ) : (
                children
              )
            ) : (
              <Text className="text-sm text-muted-foreground text-left">Chain of Thought</Text>
            )}
          </View>
          <View
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          >
            <ChevronDownIcon size={16} className="text-muted-foreground" />
          </View>
        </CollapsibleTrigger>
      </Collapsible>
    );
  },
);

/* -------------------------- ChainOfThoughtStep --------------------------- */

const stepStatusStyles = {
  active: 'text-foreground',
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground opacity-50',
};

export type ChainOfThoughtStepProps = ViewProps & {
  className?: string;
  icon?: typeof DotIcon;
  label: ReactNode;
  description?: ReactNode;
  status?: 'complete' | 'active' | 'pending';
};

export const ChainOfThoughtStep = memo(
  ({
    className,
    icon: Icon = DotIcon,
    label,
    description,
    status = 'complete',
    children,
    ...props
  }: ChainOfThoughtStepProps) => (
    <View
      className={cn(
        'flex-row gap-2',
        stepStatusStyles[status],
        className,
      )}
      {...props}
    >
      <View className="mt-0.5">
        <Icon size={16} />
      </View>
      <View className="flex-1 gap-2 overflow-hidden">
        <View>
          {typeof label === 'string' ? (
            <Text className="text-sm">{label}</Text>
          ) : (
            label
          )}
        </View>
        {description ? (
          <View>
            {typeof description === 'string' ? (
              <Text className="text-xs text-muted-foreground">{description}</Text>
            ) : (
              description
            )}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  ),
);

/* -------------------- ChainOfThoughtSearchResults ----------------------- */

export type ChainOfThoughtSearchResultsProps = ViewProps & {
  className?: string;
};

export const ChainOfThoughtSearchResults = memo(
  ({ className, ...props }: ChainOfThoughtSearchResultsProps) => (
    <View
      className={cn('flex-row flex-wrap items-center gap-2', className)}
      {...props}
    />
  ),
);

/* -------------------- ChainOfThoughtSearchResult ------------------------ */

export type ChainOfThoughtSearchResultProps = BadgeProps;

export const ChainOfThoughtSearchResult = memo(
  ({ className, children, ...props }: ChainOfThoughtSearchResultProps) => (
    <Badge
      className={cn('gap-1 px-2 py-0.5', className)}
      variant="secondary"
      {...props}
    >
      {children}
    </Badge>
  ),
);

/* ------------------------- ChainOfThoughtContent ------------------------- */

export type ChainOfThoughtContentProps = ViewProps & {
  className?: string;
};

export const ChainOfThoughtContent = memo(
  ({ className, children, ...props }: ChainOfThoughtContentProps) => {
    const { isOpen } = useChainOfThought();

    return (
      <Collapsible open={isOpen}>
        <CollapsibleContent className={cn('mt-2 gap-3', className)} {...props}>
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

/* -------------------------- ChainOfThoughtImage -------------------------- */

export type ChainOfThoughtImageProps = ViewProps & {
  className?: string;
  caption?: string;
};

export const ChainOfThoughtImage = memo(
  ({ className, children, caption, ...props }: ChainOfThoughtImageProps) => (
    <View className={cn('mt-2 gap-2', className)} {...props}>
      <View className="items-center justify-center overflow-hidden rounded-lg bg-muted p-3" style={{ maxHeight: 352 }}>
        {children}
      </View>
      {caption ? (
        <Text className="text-xs text-muted-foreground">{caption}</Text>
      ) : null}
    </View>
  ),
);

ChainOfThought.displayName = 'ChainOfThought';
ChainOfThoughtHeader.displayName = 'ChainOfThoughtHeader';
ChainOfThoughtStep.displayName = 'ChainOfThoughtStep';
ChainOfThoughtSearchResults.displayName = 'ChainOfThoughtSearchResults';
ChainOfThoughtSearchResult.displayName = 'ChainOfThoughtSearchResult';
ChainOfThoughtContent.displayName = 'ChainOfThoughtContent';
ChainOfThoughtImage.displayName = 'ChainOfThoughtImage';
