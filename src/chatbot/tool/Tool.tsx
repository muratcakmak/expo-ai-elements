import React, { isValidElement } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import type { DynamicToolUIPart, ToolUIPart } from 'ai';
import {
  WrenchIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
} from 'lucide-react-native';
import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
} from '../../primitives/Collapsible';
import { CodeBlock } from '../../code/code-block/CodeBlock';

/* --------------------------------- Types --------------------------------- */

export type ToolPart = ToolUIPart | DynamicToolUIPart;

/* ----------------------------- Status Records ----------------------------- */

const statusLabels: Record<ToolPart['state'], string> = {
  'approval-requested': 'Awaiting Approval',
  'approval-responded': 'Responded',
  'input-available': 'Running',
  'input-streaming': 'Pending',
  'output-available': 'Completed',
  'output-denied': 'Denied',
  'output-error': 'Error',
};

const STATUS_ICON_SIZE = 14;

const statusIconConfigs: Record<
  ToolPart['state'],
  { Icon: typeof ClockIcon; color: string }
> = {
  'approval-requested': { Icon: ClockIcon, color: 'text-yellow-600' },
  'approval-responded': { Icon: CheckCircle2Icon, color: 'text-blue-600' },
  'input-available': { Icon: ClockIcon, color: 'text-muted-foreground' },
  'input-streaming': { Icon: CircleIcon, color: 'text-muted-foreground' },
  'output-available': { Icon: CheckCircle2Icon, color: 'text-green-600' },
  'output-denied': { Icon: XCircleIcon, color: 'text-orange-600' },
  'output-error': { Icon: XCircleIcon, color: 'text-red-600' },
};

/* ------------------------------ StatusBadge ------------------------------ */

export const getStatusBadge = (status: ToolPart['state']) => {
  const { Icon, color } = statusIconConfigs[status];

  return (
    <Badge className="flex-row items-center gap-1.5 rounded-full px-2 py-0.5" variant="secondary">
      <Icon size={STATUS_ICON_SIZE} className={color} />
      <Text className="text-xs text-secondary-foreground">{statusLabels[status]}</Text>
    </Badge>
  );
};

/* ---------------------------------- Tool ---------------------------------- */

export type ToolProps = React.ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn('w-full rounded-md border border-border', className)}
    {...props}
  />
);

/* ------------------------------- ToolHeader ------------------------------ */

export type ToolHeaderProps = ViewProps & {
  className?: string;
  title?: string;
} & (
    | { type: ToolUIPart['type']; state: ToolUIPart['state']; toolName?: never }
    | {
        type: DynamicToolUIPart['type'];
        state: DynamicToolUIPart['state'];
        toolName: string;
      }
  );

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  toolName,
}: ToolHeaderProps) => {
  const { open } = useCollapsible();
  const derivedName =
    type === 'dynamic-tool' ? toolName : type.split('-').slice(1).join('-');

  return (
    <CollapsibleTrigger
      className={cn(
        'flex-row w-full items-center justify-between gap-4 p-3',
        className,
      )}
    >
      <View className="flex-row items-center gap-2 flex-1">
        <WrenchIcon size={16} className="text-muted-foreground" />
        <Text className="font-medium text-sm text-foreground">{title ?? derivedName}</Text>
        {getStatusBadge(state)}
      </View>
      <View
        style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
      >
        <ChevronDownIcon size={16} className="text-muted-foreground" />
      </View>
    </CollapsibleTrigger>
  );
};

/* ------------------------------ ToolContent ------------------------------ */

export type ToolContentProps = React.ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent className={cn('gap-4 p-4', className)} {...props} />
);

/* ------------------------------- ToolInput ------------------------------- */

export type ToolInputProps = ViewProps & {
  className?: string;
  input: ToolPart['input'];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <View className={cn('gap-2 overflow-hidden', className)} {...props}>
    <Text className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </Text>
    <View className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </View>
  </View>
);

/* ------------------------------- ToolOutput ------------------------------ */

export type ToolOutputProps = ViewProps & {
  className?: string;
  output: ToolPart['output'];
  errorText: ToolPart['errorText'];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let OutputElement: ReactNode = <View><Text>{String(output)}</Text></View>;

  if (typeof output === 'object' && !isValidElement(output)) {
    OutputElement = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === 'string') {
    OutputElement = <CodeBlock code={output} language="json" />;
  }

  return (
    <View className={cn('gap-2', className)} {...props}>
      <Text className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? 'Error' : 'Result'}
      </Text>
      <View
        className={cn(
          'overflow-hidden rounded-md',
          errorText ? 'bg-destructive/10' : 'bg-muted/50',
        )}
      >
        {errorText ? <Text className="p-3 text-xs text-destructive">{errorText}</Text> : null}
        {OutputElement}
      </View>
    </View>
  );
};
