import React, { createContext, useContext, useMemo } from 'react';
import { Text, type ViewProps } from 'react-native';
import { ChevronsUpDownIcon } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../../primitives/Card';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';
import { Shimmer } from '../shimmer/Shimmer';

/* --------------------------------- Context -------------------------------- */

interface PlanContextValue {
  isStreaming: boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('Plan components must be used within Plan');
  }
  return context;
};

/* ----------------------------------- Plan ---------------------------------- */

export type PlanProps = React.ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
};

export const Plan = ({
  className,
  isStreaming = false,
  children,
  ...props
}: PlanProps) => {
  const contextValue = useMemo(() => ({ isStreaming }), [isStreaming]);

  return (
    <PlanContext.Provider value={contextValue}>
      <Collapsible className={cn(className)} {...props}>
        <Card className="shadow-none">{children}</Card>
      </Collapsible>
    </PlanContext.Provider>
  );
};

/* ----------------------------- PlanHeader -------------------------------- */

export type PlanHeaderProps = React.ComponentProps<typeof CardHeader>;

export const PlanHeader = ({ className, ...props }: PlanHeaderProps) => (
  <CardHeader
    className={cn('flex-row items-start justify-between', className)}
    {...props}
  />
);

/* ------------------------------ PlanTitle -------------------------------- */

export type PlanTitleProps = Omit<
  React.ComponentProps<typeof CardTitle>,
  'children'
> & {
  children: string;
};

export const PlanTitle = ({ children, ...props }: PlanTitleProps) => {
  const { isStreaming } = usePlan();

  return (
    <CardTitle {...props}>
      {isStreaming ? <Shimmer>{children}</Shimmer> : <Text className="font-semibold leading-none text-card-foreground">{children}</Text>}
    </CardTitle>
  );
};

/* --------------------------- PlanDescription ----------------------------- */

export type PlanDescriptionProps = Omit<
  React.ComponentProps<typeof CardDescription>,
  'children'
> & {
  children: string;
};

export const PlanDescription = ({
  className,
  children,
  ...props
}: PlanDescriptionProps) => {
  const { isStreaming } = usePlan();

  return (
    <CardDescription className={cn(className)} {...props}>
      {isStreaming ? <Shimmer>{children}</Shimmer> : <Text className="text-sm text-muted-foreground">{children}</Text>}
    </CardDescription>
  );
};

/* ------------------------------ PlanAction ------------------------------- */

export type PlanActionProps = React.ComponentProps<typeof CardAction>;

export const PlanAction = (props: PlanActionProps) => <CardAction {...props} />;

/* ----------------------------- PlanContent ------------------------------- */

export type PlanContentProps = React.ComponentProps<typeof CardContent>;

export const PlanContent = (props: PlanContentProps) => (
  <CollapsibleContent>
    <CardContent {...props} />
  </CollapsibleContent>
);

/* ------------------------------ PlanFooter ------------------------------- */

export type PlanFooterProps = React.ComponentProps<typeof CardFooter>;

export const PlanFooter = (props: PlanFooterProps) => (
  <CardFooter {...props} />
);

/* ----------------------------- PlanTrigger ------------------------------- */

export type PlanTriggerProps = ViewProps & {
  className?: string;
};

export const PlanTrigger = ({ className }: PlanTriggerProps) => (
  <CollapsibleTrigger>
    <Button
      className={cn('h-8 w-8', className)}
      size="icon-sm"
      variant="ghost"
    >
      <ChevronsUpDownIcon size={16} className="text-muted-foreground" />
    </Button>
  </CollapsibleTrigger>
);
