import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  FileText as FileTextIcon,
  Globe as GlobeIcon,
  Image as ImageIcon,
  Music2 as Music2Icon,
  Paperclip as PaperclipIcon,
  Video as VideoIcon,
  X as XIcon,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View, type ViewProps } from 'react-native';

// ============================================================================
// Types
// ============================================================================

type AttachmentData = {
  id: string;
  type: 'file' | 'source-document';
  filename?: string;
  mediaType?: string;
  url?: string;
  title?: string;
};

type AttachmentMediaCategory = 'image' | 'video' | 'audio' | 'document' | 'source' | 'unknown';

type AttachmentVariant = 'grid' | 'inline' | 'list';

const mediaCategoryIcons: Record<AttachmentMediaCategory, LucideIcon> = {
  audio: Music2Icon,
  document: FileTextIcon,
  image: ImageIcon,
  source: GlobeIcon,
  unknown: PaperclipIcon,
  video: VideoIcon,
};

// ============================================================================
// Utility Functions
// ============================================================================

const getMediaCategory = (data: AttachmentData): AttachmentMediaCategory => {
  if (data.type === 'source-document') {
    return 'source';
  }

  const mediaType = data.mediaType ?? '';

  if (mediaType.startsWith('image/')) return 'image';
  if (mediaType.startsWith('video/')) return 'video';
  if (mediaType.startsWith('audio/')) return 'audio';
  if (mediaType.startsWith('application/') || mediaType.startsWith('text/')) return 'document';

  return 'unknown';
};

const getAttachmentLabel = (data: AttachmentData): string => {
  if (data.type === 'source-document') {
    return data.title || data.filename || 'Source';
  }

  const category = getMediaCategory(data);
  return data.filename || (category === 'image' ? 'Image' : 'Attachment');
};

// ============================================================================
// Contexts
// ============================================================================

type AttachmentsContextValue = {
  variant: AttachmentVariant;
};

const AttachmentsContext = React.createContext<AttachmentsContextValue | null>(null);

type AttachmentContextValue = {
  data: AttachmentData;
  mediaCategory: AttachmentMediaCategory;
  onRemove?: () => void;
  variant: AttachmentVariant;
};

const AttachmentContext = React.createContext<AttachmentContextValue | null>(null);

// ============================================================================
// Hooks
// ============================================================================

const useAttachmentsContext = () =>
  React.useContext(AttachmentsContext) ?? { variant: 'grid' as const };

const useAttachmentContext = () => {
  const ctx = React.useContext(AttachmentContext);
  if (!ctx) {
    throw new Error('Attachment components must be used within <Attachment>');
  }
  return ctx;
};

// ============================================================================
// Attachments - Container
// ============================================================================

type AttachmentsProps = ViewProps & {
  variant?: AttachmentVariant;
};

const Attachments = React.memo(function Attachments({
  variant = 'grid',
  className,
  children,
  ...props
}: AttachmentsProps) {
  const contextValue = React.useMemo(() => ({ variant }), [variant]);

  return (
    <AttachmentsContext.Provider value={contextValue}>
      <View
        className={cn(
          'flex-row flex-wrap items-start gap-2',
          variant === 'list' && 'flex-col',
          variant === 'grid' && 'ml-auto',
          className
        )}
        {...props}
      >
        {children}
      </View>
    </AttachmentsContext.Provider>
  );
});

Attachments.displayName = 'Attachments';

// ============================================================================
// Attachment - Item
// ============================================================================

type AttachmentProps = ViewProps & {
  data: AttachmentData;
  onRemove?: () => void;
};

const Attachment = React.memo(function Attachment({
  data,
  onRemove,
  className,
  children,
  ...props
}: AttachmentProps) {
  const { variant } = useAttachmentsContext();
  const mediaCategory = getMediaCategory(data);

  const contextValue = React.useMemo<AttachmentContextValue>(
    () => ({ data, mediaCategory, onRemove, variant }),
    [data, mediaCategory, onRemove, variant]
  );

  return (
    <AttachmentContext.Provider value={contextValue}>
      <View
        className={cn(
          'relative',
          variant === 'grid' && 'h-24 w-24 overflow-hidden rounded-lg',
          variant === 'inline' && 'flex-row h-8 items-center gap-1.5 rounded-md border border-border px-1.5',
          variant === 'list' && 'flex-row w-full items-center gap-3 rounded-lg border border-border p-3',
          className
        )}
        {...props}
      >
        {children}
      </View>
    </AttachmentContext.Provider>
  );
});

Attachment.displayName = 'Attachment';

// ============================================================================
// AttachmentPreview - Media preview
// ============================================================================

type AttachmentPreviewProps = ViewProps & {
  fallbackIcon?: React.ReactNode;
};

const AttachmentPreview = React.memo(function AttachmentPreview({
  fallbackIcon,
  className,
  ...props
}: AttachmentPreviewProps) {
  const { data, mediaCategory, variant } = useAttachmentContext();

  const iconSize = variant === 'inline' ? 'size-3' : 'size-4';

  const renderContent = () => {
    if (mediaCategory === 'image' && data.type === 'file' && data.url) {
      if (variant === 'grid') {
        return (
          <Image
            source={{ uri: data.url }}
            className="h-full w-full"
            resizeMode="cover"
            accessibilityLabel={data.filename || 'Image'}
          />
        );
      }
      return (
        <Image
          source={{ uri: data.url }}
          className="h-full w-full rounded"
          resizeMode="cover"
          accessibilityLabel={data.filename || 'Image'}
        />
      );
    }

    const IconComponent = mediaCategoryIcons[mediaCategory];
    return fallbackIcon ?? <Icon as={IconComponent} className={cn(iconSize, 'text-muted-foreground')} />;
  };

  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center overflow-hidden',
        variant === 'grid' && 'h-full w-full bg-muted',
        variant === 'inline' && 'h-5 w-5 rounded bg-background',
        variant === 'list' && 'h-12 w-12 rounded bg-muted',
        className
      )}
      {...props}
    >
      {renderContent()}
    </View>
  );
});

AttachmentPreview.displayName = 'AttachmentPreview';

// ============================================================================
// AttachmentInfo - Name and type display
// ============================================================================

type AttachmentInfoProps = ViewProps & {
  showMediaType?: boolean;
};

const AttachmentInfo = React.memo(function AttachmentInfo({
  showMediaType = false,
  className,
  ...props
}: AttachmentInfoProps) {
  const { data, variant } = useAttachmentContext();
  const label = getAttachmentLabel(data);

  if (variant === 'grid') {
    return null;
  }

  return (
    <View className={cn('min-w-0 flex-1', className)} {...props}>
      <Text className="text-sm" numberOfLines={1}>
        {label}
      </Text>
      {showMediaType && data.mediaType ? (
        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
          {data.mediaType}
        </Text>
      ) : null}
    </View>
  );
});

AttachmentInfo.displayName = 'AttachmentInfo';

// ============================================================================
// AttachmentRemove - Remove button
// ============================================================================

type AttachmentRemoveProps = {
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

const AttachmentRemove = React.memo(function AttachmentRemove({
  label = 'Remove',
  className,
  children,
}: AttachmentRemoveProps) {
  const { onRemove, variant } = useAttachmentContext();

  if (!onRemove) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={cn(
        'items-center justify-center',
        variant === 'grid' && 'bg-background/80 absolute right-2 top-2 h-6 w-6 rounded-full',
        variant === 'inline' && 'h-5 w-5 rounded',
        variant === 'list' && 'h-8 w-8 shrink-0 rounded',
        className
      )}
      onPress={onRemove}
    >
      {children ?? (
        <Icon
          as={XIcon}
          className={cn(
            'text-muted-foreground',
            variant === 'grid' && 'size-3',
            variant === 'inline' && 'size-2.5',
            variant === 'list' && 'size-4'
          )}
        />
      )}
    </Pressable>
  );
});

AttachmentRemove.displayName = 'AttachmentRemove';

// ============================================================================
// AttachmentEmpty - Empty state
// ============================================================================

type AttachmentEmptyProps = ViewProps;

const AttachmentEmpty = React.memo(function AttachmentEmpty({
  className,
  children,
  ...props
}: AttachmentEmptyProps) {
  return (
    <View
      className={cn('items-center justify-center p-4', className)}
      {...props}
    >
      {children ?? (
        <Text className="text-muted-foreground text-sm">No attachments</Text>
      )}
    </View>
  );
});

AttachmentEmpty.displayName = 'AttachmentEmpty';

export {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  AttachmentEmpty,
  getMediaCategory,
  getAttachmentLabel,
  useAttachmentsContext,
  useAttachmentContext,
};

export type {
  AttachmentsProps,
  AttachmentProps,
  AttachmentPreviewProps,
  AttachmentInfoProps,
  AttachmentRemoveProps,
  AttachmentEmptyProps,
  AttachmentData,
  AttachmentMediaCategory,
  AttachmentVariant,
};
