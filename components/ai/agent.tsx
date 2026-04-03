import { cn } from '@/lib/utils';
import { MONO_STYLE } from '@/lib/fonts';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import { BotIcon, ChevronDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- Agent (container) ---

type AgentProps = {
  children?: React.ReactNode;
  className?: string;
};

const Agent = React.memo(function Agent({ children, className }: AgentProps) {
  return (
    <View className={cn('border-border rounded-md border', className)}>
      {children}
    </View>
  );
});

Agent.displayName = 'Agent';

// --- AgentHeader ---

type AgentHeaderProps = {
  name: string;
  model?: string;
  className?: string;
};

const AgentHeader = React.memo(function AgentHeader({
  name,
  model,
  className,
}: AgentHeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between gap-4 p-3', className)}>
      <View className="flex-row items-center gap-2">
        <Icon as={BotIcon} className="text-muted-foreground size-4" />
        <Text className="text-foreground text-sm font-medium">{name}</Text>
        {model ? (
          <View className="bg-secondary rounded-full px-2 py-0.5">
            <Text style={MONO_STYLE} className="text-secondary-foreground text-xs">{model}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

AgentHeader.displayName = 'AgentHeader';

// --- AgentContent ---

type AgentContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const AgentContent = React.memo(function AgentContent({
  children,
  className,
}: AgentContentProps) {
  return <View className={cn('gap-4 p-4 pt-0', className)}>{children}</View>;
});

AgentContent.displayName = 'AgentContent';

// --- AgentInstructions ---

type AgentInstructionsProps = {
  children: string;
  className?: string;
};

const AgentInstructions = React.memo(function AgentInstructions({
  children,
  className,
}: AgentInstructionsProps) {
  return (
    <View className={cn('gap-2', className)}>
      <Text className="text-muted-foreground text-sm font-medium">Instructions</Text>
      <View className="bg-muted/50 rounded-md p-3">
        <Text className="text-muted-foreground text-sm">{children}</Text>
      </View>
    </View>
  );
});

AgentInstructions.displayName = 'AgentInstructions';

// --- AgentTools (accordion-like container) ---

type AgentToolsProps = {
  children?: React.ReactNode;
  className?: string;
};

const AgentTools = React.memo(function AgentTools({
  children,
  className,
}: AgentToolsProps) {
  return (
    <View className={cn('gap-2', className)}>
      <Text className="text-muted-foreground text-sm font-medium">Tools</Text>
      <View className="border-border rounded-md border">{children}</View>
    </View>
  );
});

AgentTools.displayName = 'AgentTools';

// --- AgentTool (individual tool with collapsible schema) ---

type AgentToolSchema = {
  description?: string;
  inputSchema?: Record<string, unknown>;
  jsonSchema?: Record<string, unknown>;
};

type AgentToolProps = {
  tool: AgentToolSchema;
  className?: string;
};

const AgentTool = React.memo(function AgentTool({ tool, className }: AgentToolProps) {
  const schema =
    tool.jsonSchema ?? tool.inputSchema;

  return (
    <Collapsible.Root className={cn('border-border border-b last:border-b-0', className)}>
      <Collapsible.Trigger asChild>
        <Pressable className="flex-row items-center justify-between px-3 py-2">
          <Text className="text-foreground flex-1 text-sm">
            {tool.description ?? 'No description'}
          </Text>
          <Icon as={ChevronDownIcon} className="text-muted-foreground size-4" />
        </Pressable>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="px-3 pb-3">
          <View className="bg-muted/50 rounded-md p-3">
            <Text style={MONO_STYLE} className="text-muted-foreground text-xs">
              {schema ? JSON.stringify(schema, null, 2) : 'No schema available'}
            </Text>
          </View>
        </View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});

AgentTool.displayName = 'AgentTool';

// --- AgentOutput ---

type AgentOutputProps = {
  schema: string;
  className?: string;
};

const AgentOutput = React.memo(function AgentOutput({
  schema,
  className,
}: AgentOutputProps) {
  return (
    <View className={cn('gap-2', className)}>
      <Text className="text-muted-foreground text-sm font-medium">Output Schema</Text>
      <View className="bg-muted/50 rounded-md p-3">
        <Text style={MONO_STYLE} className="text-foreground text-xs">{schema}</Text>
      </View>
    </View>
  );
});

AgentOutput.displayName = 'AgentOutput';

export {
  Agent,
  AgentHeader,
  AgentContent,
  AgentInstructions,
  AgentTools,
  AgentTool,
  AgentOutput,
};
export type {
  AgentProps,
  AgentHeaderProps,
  AgentContentProps,
  AgentInstructionsProps,
  AgentToolsProps,
  AgentToolProps,
  AgentToolSchema,
  AgentOutputProps,
};
