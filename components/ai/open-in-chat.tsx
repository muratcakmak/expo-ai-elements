import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ExternalLinkIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import * as Linking from 'expo-linking';
import * as React from 'react';
import { View } from 'react-native';

type AppKey = 'chatgpt' | 'claude' | 'gemini';

type OpenInChatProps = {
  prompt: string;
  apps?: AppKey[];
  className?: string;
};

const APP_CONFIG: Record<AppKey, { label: string; url: (prompt: string) => string }> = {
  chatgpt: {
    label: 'ChatGPT',
    url: (prompt) => `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`,
  },
  claude: {
    label: 'Claude',
    url: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  gemini: {
    label: 'Gemini',
    url: (prompt) => `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`,
  },
};

const DEFAULT_APPS: AppKey[] = ['chatgpt', 'claude', 'gemini'];

function OpenInChat({ prompt, apps = DEFAULT_APPS, className }: OpenInChatProps) {
  const handleOpen = React.useCallback(
    (app: AppKey) => {
      const config = APP_CONFIG[app];
      Linking.openURL(config.url(prompt));
    },
    [prompt]
  );

  return (
    <View className={cn('flex-row flex-wrap items-center gap-2', className)}>
      {apps.map((app) => (
        <Button
          key={app}
          variant="outline"
          size="sm"
          className="gap-1.5"
          onPress={() => handleOpen(app)}
        >
          <Icon as={ExternalLinkIcon} className="text-muted-foreground size-3.5" />
          <Text className="text-sm">{APP_CONFIG[app].label}</Text>
        </Button>
      ))}
    </View>
  );
}

OpenInChat.displayName = 'OpenInChat';

export { OpenInChat };
export type { OpenInChatProps };
