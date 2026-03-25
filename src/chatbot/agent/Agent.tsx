import React, { memo } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { BotIcon } from 'lucide-react-native';
import type { Tool } from 'ai';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../primitives/Accordion';
import { CodeBlock } from '../../code/code-block/CodeBlock';

/* ---------------------------------- Agent --------------------------------- */

export type AgentProps = ViewProps & {
  className?: string;
};

export const Agent = memo(({ className, ...props }: AgentProps) => (
  <View
    className={cn('w-full rounded-md border border-border', className)}
    {...props}
  />
));

/* ------------------------------- AgentHeader ------------------------------ */

export type AgentHeaderProps = ViewProps & {
  className?: string;
  name: string;
  model?: string;
};

export const AgentHeader = memo(
  ({ className, name, model, ...props }: AgentHeaderProps) => (
    <View
      className={cn(
        'flex-row w-full items-center justify-between gap-4 p-3',
        className,
      )}
      {...props}
    >
      <View className="flex-row items-center gap-2">
        <BotIcon size={16} className="text-muted-foreground" />
        <Text className="font-medium text-sm text-foreground">{name}</Text>
        {model ? (
          <Badge className="px-2 py-0.5" variant="secondary">
            <Text className="font-mono text-xs text-secondary-foreground">{model}</Text>
          </Badge>
        ) : null}
      </View>
    </View>
  ),
);

/* ------------------------------ AgentContent ------------------------------ */

export type AgentContentProps = ViewProps & {
  className?: string;
};

export const AgentContent = memo(
  ({ className, ...props }: AgentContentProps) => (
    <View className={cn('gap-4 px-4 pb-4', className)} {...props} />
  ),
);

/* --------------------------- AgentInstructions ---------------------------- */

export type AgentInstructionsProps = ViewProps & {
  className?: string;
  children: string;
};

export const AgentInstructions = memo(
  ({ className, children, ...props }: AgentInstructionsProps) => (
    <View className={cn('gap-2', className)} {...props}>
      <Text className="font-medium text-sm text-muted-foreground">
        Instructions
      </Text>
      <View className="rounded-md bg-muted/50 p-3">
        <Text className="text-sm text-muted-foreground">{children}</Text>
      </View>
    </View>
  ),
);

/* ------------------------------- AgentTools ------------------------------- */

export type AgentToolsProps = React.ComponentProps<typeof Accordion>;

export const AgentTools = memo(({ className, ...props }: AgentToolsProps) => (
  <View className={cn('gap-2', className)}>
    <Text className="font-medium text-sm text-muted-foreground">Tools</Text>
    <View className="rounded-md border border-border">
      <Accordion {...props} />
    </View>
  </View>
));

/* -------------------------------- AgentTool ------------------------------- */

export type AgentToolProps = React.ComponentProps<typeof AccordionItem> & {
  tool: Tool;
};

export const AgentTool = memo(
  ({ className, tool, value, ...props }: AgentToolProps) => {
    const schema =
      'jsonSchema' in tool && tool.jsonSchema
        ? tool.jsonSchema
        : tool.inputSchema;

    return (
      <AccordionItem
        className={cn('border-b border-border', className)}
        value={value}
        {...props}
      >
        <AccordionTrigger className="px-3 py-2">
          <Text className="text-sm text-foreground">
            {tool.description ?? 'No description'}
          </Text>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <View className="rounded-md bg-muted/50">
            <CodeBlock code={JSON.stringify(schema, null, 2)} language="json" />
          </View>
        </AccordionContent>
      </AccordionItem>
    );
  },
);

/* ------------------------------ AgentOutput ------------------------------- */

export type AgentOutputProps = ViewProps & {
  className?: string;
  schema: string;
};

export const AgentOutput = memo(
  ({ className, schema, ...props }: AgentOutputProps) => (
    <View className={cn('gap-2', className)} {...props}>
      <Text className="font-medium text-sm text-muted-foreground">
        Output Schema
      </Text>
      <View className="rounded-md bg-muted/50">
        <CodeBlock code={schema} language="typescript" />
      </View>
    </View>
  ),
);

Agent.displayName = 'Agent';
AgentHeader.displayName = 'AgentHeader';
AgentContent.displayName = 'AgentContent';
AgentInstructions.displayName = 'AgentInstructions';
AgentTools.displayName = 'AgentTools';
AgentTool.displayName = 'AgentTool';
AgentOutput.displayName = 'AgentOutput';
