import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Globe } from 'lucide-react-native';

type WebPreviewProps = {
  url: string;
  title?: string;
  className?: string;
};

function WebPreview({ url, title, className }: WebPreviewProps) {
  const [loading, setLoading] = React.useState(true);

  return (
    <View
      className={cn('bg-card border-border overflow-hidden rounded-xl border', className)}
    >
      {/* URL Bar Header */}
      <View className="border-border flex-row items-center gap-2 border-b px-3 py-2.5">
        <Icon as={Globe} className="text-muted-foreground size-4" />
        <Text className="text-muted-foreground flex-1 text-xs" numberOfLines={1}>
          {title ?? url}
        </Text>
        {loading ? <ActivityIndicator size="small" /> : null}
      </View>

      {/* WebView */}
      <View className="h-64">
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

WebPreview.displayName = 'WebPreview';

export { WebPreview };
export type { WebPreviewProps };
