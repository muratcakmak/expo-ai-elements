import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type SchemaDisplayProps = {
  data: unknown;
  collapsed?: boolean;
  className?: string;
};

function SchemaDisplay({ data, collapsed = false, className }: SchemaDisplayProps) {
  return (
    <View className={cn('bg-card border-border overflow-hidden rounded-xl border p-3', className)}>
      <SchemaValue value={data} defaultCollapsed={collapsed} depth={0} />
    </View>
  );
}

// --- Internal components ---

type SchemaValueProps = {
  value: unknown;
  defaultCollapsed: boolean;
  depth: number;
  keyName?: string;
};

function SchemaValue({ value, defaultCollapsed, depth, keyName }: SchemaValueProps) {
  if (value === null) {
    return (
      <View className="flex-row flex-wrap">
        {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
        <Text className="text-sm font-mono text-orange-400">null</Text>
      </View>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <View className="flex-row flex-wrap">
        {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
        <Text className="text-sm font-mono text-orange-400">{String(value)}</Text>
      </View>
    );
  }

  if (typeof value === 'number') {
    return (
      <View className="flex-row flex-wrap">
        {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
        <Text className="text-sm font-mono text-blue-400">{String(value)}</Text>
      </View>
    );
  }

  if (typeof value === 'string') {
    return (
      <View className="flex-row flex-wrap">
        {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
        <Text className="text-sm font-mono text-green-400">"{value}"</Text>
      </View>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <View className="flex-row flex-wrap">
          {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
          <Text className="text-muted-foreground text-sm font-mono">[]</Text>
        </View>
      );
    }

    return (
      <CollapsibleNode
        keyName={keyName}
        bracket={['[', ']']}
        count={value.length}
        defaultCollapsed={defaultCollapsed}
      >
        {value.map((item, index) => (
          <View key={index} style={{ paddingLeft: 16 }}>
            <SchemaValue value={item} defaultCollapsed={defaultCollapsed} depth={depth + 1} />
          </View>
        ))}
      </CollapsibleNode>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <View className="flex-row flex-wrap">
          {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
          <Text className="text-muted-foreground text-sm font-mono">{'{}'}</Text>
        </View>
      );
    }

    return (
      <CollapsibleNode
        keyName={keyName}
        bracket={['{', '}']}
        count={entries.length}
        defaultCollapsed={defaultCollapsed}
      >
        {entries.map(([key, val]) => (
          <View key={key} style={{ paddingLeft: 16 }}>
            <SchemaValue value={val} defaultCollapsed={defaultCollapsed} depth={depth + 1} keyName={key} />
          </View>
        ))}
      </CollapsibleNode>
    );
  }

  return (
    <View className="flex-row flex-wrap">
      {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
      <Text className="text-muted-foreground text-sm font-mono">{String(value)}</Text>
    </View>
  );
}

function SchemaKey({ name }: { name: string }) {
  return (
    <Text className="text-sm font-mono text-purple-400">
      {`"${name}": `}
    </Text>
  );
}

type CollapsibleNodeProps = {
  keyName?: string;
  bracket: [string, string];
  count: number;
  defaultCollapsed: boolean;
  children: React.ReactNode;
};

function CollapsibleNode({ keyName, bracket, count, defaultCollapsed, children }: CollapsibleNodeProps) {
  const [open, setOpen] = React.useState(!defaultCollapsed);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Pressable className="flex-row flex-wrap active:opacity-70">
          {keyName !== undefined ? <SchemaKey name={keyName} /> : null}
          <Text className="text-muted-foreground text-sm font-mono">
            {bracket[0]}
            {!open ? ` ... ${count} items ${bracket[1]}` : ''}
          </Text>
        </Pressable>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="gap-0.5">
          {children}
        </View>
        <Text className="text-muted-foreground text-sm font-mono">{bracket[1]}</Text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

SchemaDisplay.displayName = 'SchemaDisplay';

export { SchemaDisplay };
export type { SchemaDisplayProps };
