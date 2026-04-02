import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Shimmer } from '@/components/ai/shimmer';
import * as Collapsible from '@rn-primitives/collapsible';
import { ChevronsUpDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- Context ---

type PlanContextValue = {
  isStreaming: boolean;
};

const PlanContext = React.createContext<PlanContextValue | null>(null);

function usePlan() {
  const context = React.useContext(PlanContext);
  if (!context) {
    throw new Error('Plan sub-components must be used within <Plan>');
  }
  return context;
}

// --- Plan (root) ---

type PlanProps = {
  isStreaming?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const Plan = React.memo(function Plan({
  isStreaming = false,
  defaultOpen,
  open,
  onOpenChange,
  children,
  className,
}: PlanProps) {
  const contextValue = React.useMemo(() => ({ isStreaming }), [isStreaming]);

  return (
    <PlanContext.Provider value={contextValue}>
      <Collapsible.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        className={cn('border-border rounded-lg border', className)}
      >
        {children}
      </Collapsible.Root>
    </PlanContext.Provider>
  );
});

Plan.displayName = 'Plan';

// --- PlanHeader ---

type PlanHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const PlanHeader = React.memo(function PlanHeader({ children, className }: PlanHeaderProps) {
  return (
    <View className={cn('flex-row items-start justify-between p-4', className)}>
      {children}
    </View>
  );
});

PlanHeader.displayName = 'PlanHeader';

// --- PlanTitle ---

type PlanTitleProps = {
  children: string;
  className?: string;
};

const PlanTitle = React.memo(function PlanTitle({ children, className }: PlanTitleProps) {
  const { isStreaming } = usePlan();

  return isStreaming ? (
    <Shimmer className={className}>{children}</Shimmer>
  ) : (
    <Text className={cn('text-foreground text-lg font-semibold', className)}>{children}</Text>
  );
});

PlanTitle.displayName = 'PlanTitle';

// --- PlanDescription ---

type PlanDescriptionProps = {
  children: string;
  className?: string;
};

const PlanDescription = React.memo(function PlanDescription({
  children,
  className,
}: PlanDescriptionProps) {
  const { isStreaming } = usePlan();

  return isStreaming ? (
    <Shimmer className={className}>{children}</Shimmer>
  ) : (
    <Text className={cn('text-muted-foreground text-sm', className)}>{children}</Text>
  );
});

PlanDescription.displayName = 'PlanDescription';

// --- PlanTrigger ---

type PlanTriggerProps = {
  className?: string;
};

const PlanTrigger = React.memo(function PlanTrigger({ className }: PlanTriggerProps) {
  return (
    <Collapsible.Trigger asChild>
      <Pressable
        className={cn('items-center justify-center rounded-md p-1.5', className)}
      >
        <Icon as={ChevronsUpDownIcon} className="text-muted-foreground size-4" />
      </Pressable>
    </Collapsible.Trigger>
  );
});

PlanTrigger.displayName = 'PlanTrigger';

// --- PlanContent ---

type PlanContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const PlanContent = React.memo(function PlanContent({ children, className }: PlanContentProps) {
  return (
    <Collapsible.Content>
      <View className={cn('px-4 pb-4', className)}>{children}</View>
    </Collapsible.Content>
  );
});

PlanContent.displayName = 'PlanContent';

// --- PlanFooter ---

type PlanFooterProps = {
  children?: React.ReactNode;
  className?: string;
};

const PlanFooter = React.memo(function PlanFooter({ children, className }: PlanFooterProps) {
  return (
    <View className={cn('border-border flex-row items-center border-t px-4 py-3', className)}>
      {children}
    </View>
  );
});

PlanFooter.displayName = 'PlanFooter';

// --- PlanAction ---

type PlanActionProps = {
  children?: React.ReactNode;
  className?: string;
};

const PlanAction = React.memo(function PlanAction({ children, className }: PlanActionProps) {
  return <View className={className}>{children}</View>;
});

PlanAction.displayName = 'PlanAction';

export {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanTrigger,
  PlanContent,
  PlanFooter,
  PlanAction,
  usePlan,
};
export type {
  PlanProps,
  PlanHeaderProps,
  PlanTitleProps,
  PlanDescriptionProps,
  PlanTriggerProps,
  PlanContentProps,
  PlanFooterProps,
  PlanActionProps,
};
