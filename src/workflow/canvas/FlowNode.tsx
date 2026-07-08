import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '../../utils/cn';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../../primitives/Card';

/* ---------------------------------- Types --------------------------------- */

type HandleConfig = {
  target: boolean;
  source: boolean;
};

/* ---------------------------------- Node ---------------------------------- */

type FlowNodeProps = ViewProps & {
  className?: string;
  handles: HandleConfig;
};

function FlowNode({ handles, className, children, ...props }: FlowNodeProps) {
  return (
    <Card
      className={cn(
        'relative h-auto w-80 gap-0 rounded-md p-0',
        className,
      )}
      {...props}
    >
      {handles.target && (
        <View className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
      )}
      {handles.source && (
        <View className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
      )}
      {children}
    </Card>
  );
}

/* --------------------------------- Header --------------------------------- */

type FlowNodeHeaderProps = ViewProps & {
  className?: string;
};

function FlowNodeHeader({ className, ...props }: FlowNodeHeaderProps) {
  return (
    <CardHeader
      className={cn('gap-0.5 rounded-t-md border-b border-border bg-secondary p-3', className)}
      {...props}
    />
  );
}

/* ---------------------------------- Title --------------------------------- */

type FlowNodeTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function FlowNodeTitle(props: FlowNodeTitleProps) {
  return <CardTitle {...props} />;
}

/* ------------------------------- Description ------------------------------ */

type FlowNodeDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function FlowNodeDescription(props: FlowNodeDescriptionProps) {
  return <CardDescription {...props} />;
}

/* --------------------------------- Action --------------------------------- */

type FlowNodeActionProps = ViewProps & {
  className?: string;
};

function FlowNodeAction(props: FlowNodeActionProps) {
  return <CardAction {...props} />;
}

/* -------------------------------- Content --------------------------------- */

type FlowNodeContentProps = ViewProps & {
  className?: string;
};

function FlowNodeContent({ className, ...props }: FlowNodeContentProps) {
  return <CardContent className={cn('p-3', className)} {...props} />;
}

/* --------------------------------- Footer --------------------------------- */

type FlowNodeFooterProps = ViewProps & {
  className?: string;
};

function FlowNodeFooter({ className, ...props }: FlowNodeFooterProps) {
  return (
    <CardFooter
      className={cn('rounded-b-md border-t border-border bg-secondary p-3', className)}
      {...props}
    />
  );
}

export {
  FlowNode,
  FlowNodeHeader,
  FlowNodeTitle,
  FlowNodeDescription,
  FlowNodeAction,
  FlowNodeContent,
  FlowNodeFooter,
  type FlowNodeProps,
  type FlowNodeHeaderProps,
  type FlowNodeTitleProps,
  type FlowNodeDescriptionProps,
  type FlowNodeActionProps,
  type FlowNodeContentProps,
  type FlowNodeFooterProps,
  type HandleConfig,
};
