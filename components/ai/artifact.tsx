import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Tabs from '@rn-primitives/tabs';
import * as React from 'react';
import { View } from 'react-native';
import { Code, FileText, Image, Globe, Copy } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const TYPE_ICONS: Record<string, LucideIcon> = {
  code: Code,
  text: FileText,
  image: Image,
  web: Globe,
};

type ArtifactType = 'code' | 'text' | 'image' | 'web';

type ArtifactProps = {
  title: string;
  type?: ArtifactType;
  children: React.ReactNode;
  onCopy?: () => void;
  className?: string;
};

function Artifact({ title, type = 'text', children, onCopy, className }: ArtifactProps) {
  const TypeIcon = TYPE_ICONS[type] ?? FileText;

  return (
    <View
      className={cn('bg-card border-border overflow-hidden rounded-xl border', className)}
    >
      {/* Header */}
      <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Icon as={TypeIcon} className="text-muted-foreground size-4" />
          <Text className="text-sm font-medium">{title}</Text>
        </View>
        {/* Action bar */}
        <View className="flex-row items-center gap-1">
          <Button variant="ghost" size="icon" onPress={onCopy} className="h-8 w-8">
            <Icon as={Copy} className="text-muted-foreground size-4" />
          </Button>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">{children}</View>
    </View>
  );
}

// --- ArtifactTabs: tabbed artifact container ---

type ArtifactTab = {
  value: string;
  label: string;
  children: React.ReactNode;
};

type ArtifactTabsProps = {
  title: string;
  type?: ArtifactType;
  tabs: ArtifactTab[];
  defaultTab?: string;
  onCopy?: () => void;
  className?: string;
};

function ArtifactTabs({ title, type = 'text', tabs, defaultTab, onCopy, className }: ArtifactTabsProps) {
  const TypeIcon = TYPE_ICONS[type] ?? FileText;
  const [activeTab, setActiveTab] = React.useState(defaultTab ?? tabs[0]?.value ?? '');

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <View
        className={cn('bg-card border-border overflow-hidden rounded-xl border', className)}
      >
        {/* Header */}
        <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Icon as={TypeIcon} className="text-muted-foreground size-4" />
            <Text className="text-sm font-medium">{title}</Text>
          </View>
          <Button variant="ghost" size="icon" onPress={onCopy} className="h-8 w-8">
            <Icon as={Copy} className="text-muted-foreground size-4" />
          </Button>
        </View>

        {/* Tab List */}
        <Tabs.List className="border-border flex-row border-b px-2">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'px-3 py-2',
                activeTab === tab.value && 'border-primary border-b-2'
              )}
            >
              <Text
                className={cn(
                  'text-muted-foreground text-sm',
                  activeTab === tab.value && 'text-foreground font-medium'
                )}
              >
                {tab.label}
              </Text>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="p-4">
            {tab.children}
          </Tabs.Content>
        ))}
      </View>
    </Tabs.Root>
  );
}

Artifact.displayName = 'Artifact';
ArtifactTabs.displayName = 'ArtifactTabs';

export { Artifact, ArtifactTabs };
export type { ArtifactProps, ArtifactTabsProps, ArtifactTab, ArtifactType };
