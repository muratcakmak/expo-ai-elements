import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CATEGORIES, getComponentsByCategory } from '@/lib/component-registry';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
  BotIcon,
  MessageSquareIcon,
  CodeIcon,
  BrainIcon,
  LayoutIcon,
  TextCursorInputIcon,
  WrenchIcon,
  MoonStarIcon,
  SunIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Chatbot: MessageSquareIcon,
  Code: CodeIcon,
  Reasoning: BrainIcon,
  Content: LayoutIcon,
  Input: TextCursorInputIcon,
  Utilities: WrenchIcon,
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="p-6 pb-12"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View className="items-center gap-3 py-8">
        <Icon as={BotIcon} className="text-foreground size-14" />
        <Text className="text-foreground text-center text-2xl font-bold">
          expo-ai-elements
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          AI chat components for React Native.{'\n'}Built with Reusables + Uniwind.
        </Text>
      </View>

      {/* Chat Demo CTA */}
      <Pressable
        className="bg-primary mb-8 rounded-xl px-6 py-4"
        onPress={() => router.push('/chat')}
      >
        <View className="flex-row items-center gap-3">
          <Icon as={MessageSquareIcon} className="text-primary-foreground size-5" />
          <View className="flex-1">
            <Text className="text-primary-foreground font-semibold">Chat Demo</Text>
            <Text className="text-primary-foreground/70 text-xs">
              Full chat interface with streaming
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Component Categories */}
      <Text className="text-foreground mb-4 text-lg font-semibold">Components</Text>
      <View className="gap-3">
        {CATEGORIES.map((category) => {
          const components = getComponentsByCategory(category);
          const CategoryIcon = CATEGORY_ICONS[category];
          return (
            <View key={category} className="border-border rounded-xl border p-4">
              <View className="mb-3 flex-row items-center gap-2">
                <Icon as={CategoryIcon} className="text-foreground size-4" />
                <Text className="text-foreground text-sm font-semibold">{category}</Text>
                <Text className="text-muted-foreground text-xs">({components.length})</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {components.map((comp) => (
                  <Pressable
                    key={comp.slug}
                    className="bg-secondary rounded-lg px-3 py-1.5"
                    onPress={() => router.push(`/${comp.slug}` as any)}
                  >
                    <Text className="text-secondary-foreground text-xs">{comp.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
      </View>

      {/* Theme Toggle */}
      <View className="mt-8 items-center">
        <ThemeToggle />
      </View>
    </ScrollView>
  );
}

function ThemeToggle() {
  const { theme } = useUniwind();
  return (
    <Button
      onPressIn={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
      variant="outline"
      className="flex-row gap-2"
    >
      <Icon as={theme === 'dark' ? MoonStarIcon : SunIcon} className="size-4" />
      <Text>{theme === 'dark' ? 'Dark' : 'Light'} Mode</Text>
    </Button>
  );
}
