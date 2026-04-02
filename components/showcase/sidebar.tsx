import { cn } from '@/lib/utils';
import { CATEGORIES, getComponentsByCategory, type ComponentCategory } from '@/lib/component-registry';
import { Text } from '@/components/ui/text';
import { useRouter, usePathname } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
  MessageSquareIcon,
  CodeIcon,
  BrainIcon,
  LayoutIcon,
  TextCursorInputIcon,
  WrenchIcon,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawerStatus } from '@react-navigation/drawer';

const CATEGORY_ICONS: Record<ComponentCategory, LucideIcon> = {
  Chatbot: MessageSquareIcon,
  Code: CodeIcon,
  Reasoning: BrainIcon,
  Content: LayoutIcon,
  Input: TextCursorInputIcon,
  Utilities: WrenchIcon,
};

export function Sidebar({ navigation }: { navigation?: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const navigate = React.useCallback((path: string) => {
    router.push(path as any);
    navigation?.closeDrawer?.();
  }, [router, navigation]);

  return (
    <ScrollView className="bg-background flex-1" style={{ paddingTop: insets.top + 8 }} showsVerticalScrollIndicator={false}>
      {/* Home link */}
      <Pressable
        className={cn(
          'mx-3 mb-2 rounded-lg px-3 py-2.5',
          pathname === '/' ? 'bg-accent' : ''
        )}
        onPress={() => navigate('/')}
      >
        <Text className="text-foreground text-sm font-semibold">Home</Text>
      </Pressable>

      {/* Chat demo link */}
      <Pressable
        className={cn(
          'mx-3 mb-4 rounded-lg px-3 py-2.5',
          pathname === '/chat' ? 'bg-accent' : ''
        )}
        onPress={() => navigate('/chat')}
      >
        <Text className="text-foreground text-sm font-semibold">Chat Demo</Text>
      </Pressable>

      <View className="border-border mx-3 mb-3 border-t" />

      <Text className="text-muted-foreground mx-3 mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
        Components
      </Text>

      {CATEGORIES.map((category) => (
        <SidebarCategory key={category} category={category} pathname={pathname} navigate={navigate} />
      ))}

      <View className="h-8" />
    </ScrollView>
  );
}

function SidebarCategory({
  category,
  pathname,
  navigate,
}: {
  category: ComponentCategory;
  pathname: string;
  navigate: (path: string) => void;
}) {
  const components = getComponentsByCategory(category);
  const CategoryIcon = CATEGORY_ICONS[category];

  return (
    <View className="mb-1">
      <View className="mx-3 flex-row items-center gap-2 px-3 py-2">
        <Icon as={CategoryIcon} className="text-muted-foreground size-3.5" />
        <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          {category}
        </Text>
      </View>
      {components.map((comp) => {
        const href = `/${comp.slug}`;
        const isActive = pathname === href;
        return (
          <Pressable
            key={comp.slug}
            className={cn(
              'mx-3 rounded-lg px-3 py-2 pl-9',
              isActive ? 'bg-accent' : ''
            )}
            onPress={() => navigate(href)}
          >
            <Text
              className={cn(
                'text-sm',
                isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {comp.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
