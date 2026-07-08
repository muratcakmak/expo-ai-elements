import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import {
  AudioLines,
  BookOpen,
  ChevronRight,
  Code2,
  FileText,
  FlaskConical,
  Gauge,
  LayoutGrid,
  MessagesSquare,
  PanelBottom,
  type LucideIcon,
} from 'lucide-react-native';

import { Separator } from '../../src/primitives/Separator';

/**
 * Single source of truth for the app's route catalog.
 *
 * Rendered by both the home hub (`app/index.tsx`) and the modal menu
 * (`app/menu.tsx`). Pass `onNavigate` when the catalog lives inside the modal
 * so rows can dismiss the modal before routing; omit it on the home screen so
 * rows behave as plain `<Link>`s (native gesture + accessibility for free).
 */

type CatalogRoute = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type CatalogGroup = {
  title: string;
  items: CatalogRoute[];
};

const CATALOG: CatalogGroup[] = [
  {
    title: 'Rendering',
    items: [
      {
        href: '/markdown',
        title: 'Markdown',
        description: 'Streaming markdown + LaTeX',
        icon: FileText,
      },
      {
        href: '/stress',
        title: 'Stress test',
        description: 'Super-long chat stress test',
        icon: Gauge,
      },
    ],
  },
  {
    title: 'Chat',
    items: [
      {
        href: '/chat',
        title: 'Chat',
        description: 'Streaming chat E2E, keyless mock',
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        href: '/showcase',
        title: 'Showcase',
        description: 'Primitives & component gallery',
        icon: LayoutGrid,
      },
      {
        href: '/sheets',
        title: 'Sheets',
        description: 'Bottom-sheet primitives',
        icon: PanelBottom,
      },
      {
        href: '/code',
        title: 'Code',
        description: 'Code display',
        icon: Code2,
      },
      {
        href: '/voice',
        title: 'Voice',
        description: 'Audio + speech',
        icon: AudioLines,
      },
    ],
  },
  {
    title: 'Dev',
    items: [
      {
        href: '/storybook',
        title: 'Storybook',
        description: 'Component stories',
        icon: BookOpen,
      },
      {
        href: '/smoke',
        title: 'Smoke',
        description: 'Uniwind smoke test',
        icon: FlaskConical,
      },
    ],
  },
];

/** Presentational row body — no interaction, shared by both link + button rows. */
function CatalogRowBody({ item }: { item: CatalogRoute }) {
  const Icon = item.icon;
  return (
    <View className="min-h-[56px] flex-row items-center gap-3 px-4 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-ai-md bg-ai-surface-alt">
        <Icon size={18} color="#6366f1" />
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-semibold text-ai-foreground">{item.title}</Text>
        <Text className="mt-0.5 text-[13px] text-ai-muted-foreground">{item.description}</Text>
      </View>
      <ChevronRight size={18} color="#94a3b8" />
    </View>
  );
}

function CatalogRow({
  item,
  onNavigate,
}: {
  item: CatalogRoute;
  onNavigate?: (href: string) => void;
}) {
  const pressStyle = ({ pressed }: { pressed: boolean }) => ({
    opacity: pressed ? 0.6 : 1,
  });

  if (onNavigate) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate(item.href)}
        style={pressStyle}
      >
        <CatalogRowBody item={item} />
      </Pressable>
    );
  }

  return (
    <Link href={item.href} asChild>
      <Pressable accessibilityRole="link" style={pressStyle}>
        <CatalogRowBody item={item} />
      </Pressable>
    </Link>
  );
}

export function RouteCatalog({ onNavigate }: { onNavigate?: (href: string) => void }) {
  return (
    <View className="gap-7 px-4">
      {CATALOG.map((group) => (
        <View key={group.title}>
          <Text className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-ai-muted-foreground">
            {group.title}
          </Text>
          <View className="overflow-hidden rounded-ai-lg border border-ai-border bg-ai-background">
            {group.items.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && <Separator className="ml-16 bg-ai-border" />}
                <CatalogRow item={item} onNavigate={onNavigate} />
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
