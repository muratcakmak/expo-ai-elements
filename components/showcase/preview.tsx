import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type PreviewProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Preview({ title, description, children, className }: PreviewProps) {
  return (
    <View className="bg-background flex-1">
      <ScrollView
        contentContainerClassName="p-4 pb-12"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View className="mb-6">
          <Text className="text-foreground text-2xl font-bold">{title}</Text>
          {description && (
            <Text className="text-muted-foreground mt-1 text-sm">{description}</Text>
          )}
        </View>
        <View className={cn('gap-6', className)}>{children}</View>
      </ScrollView>
    </View>
  );
}

type PreviewSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function PreviewSection({ title, description, children, className }: PreviewSectionProps) {
  return (
    <View className="gap-3">
      <View>
        <Text className="text-foreground text-base font-semibold">{title}</Text>
        {description && (
          <Text className="text-muted-foreground text-xs">{description}</Text>
        )}
      </View>
      <View
        className={cn(
          'border-border bg-card rounded-xl border p-4',
          className
        )}
      >
        {children}
      </View>
    </View>
  );
}
