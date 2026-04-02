import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from '@/components/ai';
import { Icon } from '@/components/ui/icon';
import { PreviewSection } from '@/components/showcase/preview';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

export function WebPreviewDemo() {
  return (
    <View className="gap-6">
      <PreviewSection
        title="Web preview"
        description="Interactive URL bar with back/forward navigation"
      >
        <WebPreview defaultUrl="https://expo.dev" style={{ height: 400 }}>
          <WebPreviewNavigation>
            <WebPreviewNavigationButton label="Go back">
              <Icon as={ArrowLeftIcon} className="text-muted-foreground size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton label="Go forward">
              <Icon as={ArrowRightIcon} className="text-muted-foreground size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton label="Reload">
              <Icon as={RefreshCcwIcon} className="text-muted-foreground size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewUrl />
            <WebPreviewNavigationButton label="Open in browser">
              <Icon as={ExternalLinkIcon} className="text-muted-foreground size-4" />
            </WebPreviewNavigationButton>
          </WebPreviewNavigation>
          <WebPreviewBody />
        </WebPreview>
      </PreviewSection>
    </View>
  );
}
