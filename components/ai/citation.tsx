import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View, Linking } from 'react-native';

type Source = {
  title: string;
  url: string;
  snippet?: string;
};

// --- InlineCitation ---

type InlineCitationProps = {
  index: number;
  source: Source;
  onPress?: () => void;
};

function InlineCitation({ index, source, onPress }: InlineCitationProps) {
  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL(source.url);
    }
  }, [onPress, source.url]);

  return (
    <Pressable onPress={handlePress} className="active:opacity-70">
      <Text className="text-primary text-xs font-semibold" style={{ lineHeight: 14 }}>
        [{index}]
      </Text>
    </Pressable>
  );
}

// --- Sources ---

type SourcesProps = {
  sources: Source[];
  className?: string;
};

function Sources({ sources, className }: SourcesProps) {
  return (
    <View className={cn('gap-3', className)}>
      <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
        Sources
      </Text>
      {sources.map((source, index) => (
        <Pressable
          key={`${source.url}-${index}`}
          className="bg-secondary/50 active:bg-secondary gap-1 rounded-lg px-3 py-2.5"
          onPress={() => Linking.openURL(source.url)}
        >
          <View className="flex-row items-baseline gap-2">
            <Text className="text-muted-foreground text-xs font-medium">{index + 1}.</Text>
            <Text className="text-foreground flex-1 text-sm font-medium" numberOfLines={1}>
              {source.title}
            </Text>
          </View>
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            {source.url}
          </Text>
          {source.snippet ? (
            <Text className="text-muted-foreground mt-0.5 text-xs" numberOfLines={2}>
              {source.snippet}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

InlineCitation.displayName = 'InlineCitation';
Sources.displayName = 'Sources';

export { InlineCitation, Sources };
export type { InlineCitationProps, SourcesProps, Source };
