import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { BookOpen as BookOpenIcon, ChevronDown as ChevronDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { Linking, Pressable, View, type ViewProps } from 'react-native';

// ============================================================================
// Types
// ============================================================================

type SourceData = {
  title: string;
  url: string;
  description?: string;
};

// ============================================================================
// InlineCitation - Tappable superscript badge
// ============================================================================

type InlineCitationProps = {
  sources: SourceData[];
  onPress?: () => void;
  className?: string;
};

const InlineCitation = React.memo(function InlineCitation({
  sources,
  onPress,
  className,
}: InlineCitationProps) {
  const label = React.useMemo(() => {
    if (sources.length === 0) return 'unknown';
    try {
      const hostname = new URL(sources[0].url).hostname;
      const extra = sources.length > 1 ? ` +${sources.length - 1}` : '';
      return `${hostname}${extra}`;
    } catch {
      return sources[0].title || 'source';
    }
  }, [sources]);

  return (
    <Pressable
      accessibilityRole="button"
      className={cn('active:opacity-70', className)}
      onPress={onPress}
    >
      <View className="bg-secondary ml-1 rounded-full px-2 py-0.5">
        <Text className="text-secondary-foreground text-xs font-medium">{label}</Text>
      </View>
    </Pressable>
  );
});

InlineCitation.displayName = 'InlineCitation';

// ============================================================================
// InlineCitationCard - Modal/dialog showing source details
// ============================================================================

type InlineCitationCardProps = ViewProps & {
  sources: SourceData[];
  visible?: boolean;
};

const InlineCitationCard = React.memo(function InlineCitationCard({
  sources,
  visible = true,
  className,
  ...props
}: InlineCitationCardProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : sources.length - 1));
  }, [sources.length]);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((i) => (i < sources.length - 1 ? i + 1 : 0));
  }, [sources.length]);

  if (!visible || sources.length === 0) {
    return null;
  }

  const source = sources[currentIndex];

  return (
    <View
      className={cn('border-border bg-card w-80 overflow-hidden rounded-lg border', className)}
      {...props}
    >
      {/* Header with navigation */}
      {sources.length > 1 ? (
        <View className="bg-secondary flex-row items-center justify-between px-3 py-2">
          <View className="flex-row items-center gap-2">
            <Pressable onPress={handlePrev} accessibilityLabel="Previous source">
              <Text className="text-muted-foreground text-sm">{'<'}</Text>
            </Pressable>
            <Pressable onPress={handleNext} accessibilityLabel="Next source">
              <Text className="text-muted-foreground text-sm">{'>'}</Text>
            </Pressable>
          </View>
          <Text className="text-muted-foreground text-xs">
            {currentIndex + 1}/{sources.length}
          </Text>
        </View>
      ) : null}

      {/* Source content */}
      <View className="gap-1 p-3">
        {source.title ? (
          <Text className="text-sm font-medium" numberOfLines={1}>
            {source.title}
          </Text>
        ) : null}
        {source.url ? (
          <Pressable onPress={() => Linking.openURL(source.url)}>
            <Text className="text-muted-foreground text-xs" numberOfLines={1}>
              {source.url}
            </Text>
          </Pressable>
        ) : null}
        {source.description ? (
          <Text className="text-muted-foreground mt-1 text-sm leading-relaxed" numberOfLines={3}>
            {source.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

InlineCitationCard.displayName = 'InlineCitationCard';

// ============================================================================
// Sources - Collapsible list of all sources
// ============================================================================

type SourcesProps = ViewProps & {
  count?: number;
  defaultOpen?: boolean;
};

const Sources = React.memo(function Sources({
  count,
  defaultOpen = false,
  className,
  children,
  ...props
}: SourcesProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <View className={cn('gap-2', className)} {...props}>
      <Pressable
        className="flex-row items-center gap-2"
        onPress={handleToggle}
        accessibilityRole="button"
      >
        <Text className="text-primary text-xs font-medium">
          {count !== undefined ? `Used ${count} sources` : 'Sources'}
        </Text>
        <Icon
          as={ChevronDownIcon}
          className={cn('text-primary size-4', isOpen && 'rotate-180')}
        />
      </Pressable>
      {isOpen ? children : null}
    </View>
  );
});

Sources.displayName = 'Sources';

// ============================================================================
// SourcesContent - Wrapper for source items
// ============================================================================

type SourcesContentProps = ViewProps;

const SourcesContent = React.memo(function SourcesContent({
  className,
  children,
  ...props
}: SourcesContentProps) {
  return (
    <View className={cn('mt-1 gap-2', className)} {...props}>
      {children}
    </View>
  );
});

SourcesContent.displayName = 'SourcesContent';

// ============================================================================
// Source - Individual source item
// ============================================================================

type SourceProps = {
  title?: string;
  url?: string;
  description?: string;
  onPress?: () => void;
  className?: string;
  children?: React.ReactNode;
};

const Source = React.memo(function Source({
  title,
  url,
  description,
  onPress,
  className,
  children,
}: SourceProps) {
  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
    } else if (url) {
      Linking.openURL(url);
    }
  }, [onPress, url]);

  return (
    <Pressable
      className={cn('flex-row items-center gap-2 active:opacity-70', className)}
      onPress={handlePress}
      accessibilityRole="link"
    >
      {children ?? (
        <>
          <Icon as={BookOpenIcon} className="text-primary size-4" />
          <Text className="text-primary text-xs font-medium" numberOfLines={1}>
            {title || url || 'Source'}
          </Text>
        </>
      )}
    </Pressable>
  );
});

Source.displayName = 'Source';

export {
  InlineCitation,
  InlineCitationCard,
  Sources,
  SourcesContent,
  Source,
};

export type {
  InlineCitationProps,
  InlineCitationCardProps,
  SourcesProps,
  SourcesContentProps,
  SourceProps,
  SourceData,
};
