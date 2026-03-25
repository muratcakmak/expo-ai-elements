import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageProps,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import { FileText, Globe, ImageIcon, Music2, Paperclip, Video, X } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../../primitives/HoverCard';

/* ======================================================================== */
/* Types                                                                     */
/* ======================================================================== */

export type AttachmentData = {
  id: string;
  type: 'file' | 'source-document';
  url?: string;
  filename?: string;
  mediaType?: string;
  title?: string;
};

export type AttachmentMediaCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'source'
  | 'unknown';

export type AttachmentVariant = 'grid' | 'inline' | 'list';

const mediaCategoryIcons: Record<
  AttachmentMediaCategory,
  typeof ImageIcon
> = {
  audio: Music2,
  document: FileText,
  image: ImageIcon,
  source: Globe,
  unknown: Paperclip,
  video: Video,
};

/* ======================================================================== */
/* Utility Functions                                                          */
/* ======================================================================== */

export const getMediaCategory = (
  data: AttachmentData,
): AttachmentMediaCategory => {
  if (data.type === 'source-document') {
    return 'source';
  }

  const mediaType = data.mediaType ?? '';

  if (mediaType.startsWith('image/')) {
    return 'image';
  }
  if (mediaType.startsWith('video/')) {
    return 'video';
  }
  if (mediaType.startsWith('audio/')) {
    return 'audio';
  }
  if (mediaType.startsWith('application/') || mediaType.startsWith('text/')) {
    return 'document';
  }

  return 'unknown';
};

export const getAttachmentLabel = (data: AttachmentData): string => {
  if (data.type === 'source-document') {
    return data.title || data.filename || 'Source';
  }

  const category = getMediaCategory(data);
  return data.filename || (category === 'image' ? 'Image' : 'Attachment');
};

/* ======================================================================== */
/* Contexts                                                                  */
/* ======================================================================== */

type AttachmentsContextValue = {
  variant: AttachmentVariant;
};

const AttachmentsContext = createContext<AttachmentsContextValue | null>(null);

type AttachmentContextValue = {
  data: AttachmentData;
  mediaCategory: AttachmentMediaCategory;
  onRemove?: () => void;
  variant: AttachmentVariant;
};

const AttachmentContext = createContext<AttachmentContextValue | null>(null);

/* ======================================================================== */
/* Hooks                                                                     */
/* ======================================================================== */

export const useAttachmentsContext = () =>
  useContext(AttachmentsContext) ?? { variant: 'grid' as const };

export const useAttachmentContext = () => {
  const ctx = useContext(AttachmentContext);
  if (!ctx) {
    throw new Error('Attachment components must be used within <Attachment>');
  }
  return ctx;
};

/* ======================================================================== */
/* Attachments - Container                                                   */
/* ======================================================================== */

export type AttachmentsProps = ViewProps & {
  className?: string;
  variant?: AttachmentVariant;
};

export const Attachments = ({
  variant = 'grid',
  className,
  children,
  ...props
}: AttachmentsProps) => {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <AttachmentsContext.Provider value={contextValue}>
      <View
        className={cn(
          'flex items-start',
          variant === 'list' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-2',
          variant === 'grid' && 'ml-auto',
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </AttachmentsContext.Provider>
  );
};

/* ======================================================================== */
/* Attachment - Item                                                          */
/* ======================================================================== */

export type AttachmentProps = ViewProps & {
  className?: string;
  data: AttachmentData;
  onRemove?: () => void;
};

export const Attachment = ({
  data,
  onRemove,
  className,
  children,
  ...props
}: AttachmentProps) => {
  const { variant } = useAttachmentsContext();
  const mediaCategory = getMediaCategory(data);

  const contextValue = useMemo<AttachmentContextValue>(
    () => ({ data, mediaCategory, onRemove, variant }),
    [data, mediaCategory, onRemove, variant],
  );

  return (
    <AttachmentContext.Provider value={contextValue}>
      <View
        className={cn(
          'relative',
          variant === 'grid' && 'h-24 w-24 overflow-hidden rounded-lg',
          variant === 'inline' &&
            'flex-row h-8 items-center gap-1.5 rounded-md border border-border px-1.5',
          variant === 'list' &&
            'flex-row w-full items-center gap-3 rounded-lg border border-border p-3',
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </AttachmentContext.Provider>
  );
};

/* ======================================================================== */
/* AttachmentPreview - Media preview                                          */
/* ======================================================================== */

export type AttachmentPreviewProps = ViewProps & {
  className?: string;
  fallbackIcon?: React.ReactNode;
};

export const AttachmentPreview = ({
  fallbackIcon,
  className,
  ...props
}: AttachmentPreviewProps) => {
  const { data, mediaCategory, variant } = useAttachmentContext();

  const iconSize = variant === 'inline' ? 12 : 16;

  const renderIcon = (Icon: typeof ImageIcon) => (
    <Icon size={iconSize} className="text-muted-foreground" />
  );

  const renderContent = () => {
    if (mediaCategory === 'image' && data.type === 'file' && data.url) {
      return (
        <Image
          source={{ uri: data.url }}
          className={cn(
            variant === 'grid' ? 'h-full w-full' : 'h-5 w-5 rounded',
          )}
          resizeMode="cover"
          accessibilityLabel={data.filename || 'Image'}
        />
      );
    }

    const Icon = mediaCategoryIcons[mediaCategory];
    return fallbackIcon ?? renderIcon(Icon);
  };

  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center overflow-hidden',
        variant === 'grid' && 'h-full w-full bg-muted',
        variant === 'inline' && 'h-5 w-5 rounded bg-background',
        variant === 'list' && 'h-12 w-12 rounded bg-muted',
        className,
      )}
      {...props}
    >
      {renderContent()}
    </View>
  );
};

/* ======================================================================== */
/* AttachmentInfo - Name and type display                                     */
/* ======================================================================== */

export type AttachmentInfoProps = ViewProps & {
  className?: string;
  showMediaType?: boolean;
};

export const AttachmentInfo = ({
  showMediaType = false,
  className,
  ...props
}: AttachmentInfoProps) => {
  const { data, variant } = useAttachmentContext();
  const label = getAttachmentLabel(data);

  if (variant === 'grid') {
    return null;
  }

  return (
    <View className={cn('min-w-0 flex-1', className)} {...props}>
      <Text className="text-sm text-foreground" numberOfLines={1}>
        {label}
      </Text>
      {showMediaType && data.mediaType && (
        <Text
          className="text-xs text-muted-foreground"
          numberOfLines={1}
        >
          {data.mediaType}
        </Text>
      )}
    </View>
  );
};

/* ======================================================================== */
/* AttachmentRemove - Remove button                                          */
/* ======================================================================== */

export type AttachmentRemoveProps = ButtonProps & {
  label?: string;
};

export const AttachmentRemove = ({
  label = 'Remove',
  className,
  children,
  ...props
}: AttachmentRemoveProps) => {
  const { onRemove, variant } = useAttachmentContext();

  const handlePress = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  if (!onRemove) {
    return null;
  }

  return (
    <Button
      accessibilityLabel={label}
      className={cn(
        variant === 'grid' && 'absolute top-2 right-2 h-6 w-6 rounded-full p-0',
        variant === 'inline' && 'h-5 w-5 rounded p-0',
        variant === 'list' && 'h-8 w-8 shrink-0 rounded p-0',
        className,
      )}
      onPress={handlePress}
      variant="ghost"
      {...props}
    >
      {children ?? <X size={variant === 'inline' ? 10 : 12} className="text-muted-foreground" />}
    </Button>
  );
};

/* ======================================================================== */
/* AttachmentHoverCard - Press popover                                        */
/* ======================================================================== */

export type AttachmentHoverCardProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
};

export const AttachmentHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: AttachmentHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

export type AttachmentHoverCardTriggerProps = PressableProps & {
  className?: string;
};

export const AttachmentHoverCardTrigger = (
  props: AttachmentHoverCardTriggerProps,
) => <HoverCardTrigger {...props} />;

export type AttachmentHoverCardContentProps = ViewProps & {
  className?: string;
};

export const AttachmentHoverCardContent = ({
  className,
  ...props
}: AttachmentHoverCardContentProps) => (
  <HoverCardContent className={cn('w-auto p-2', className)} {...props} />
);

/* ======================================================================== */
/* AttachmentEmpty - Empty state                                              */
/* ======================================================================== */

export type AttachmentEmptyProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const AttachmentEmpty = ({
  className,
  children,
  ...props
}: AttachmentEmptyProps) => (
  <View
    className={cn(
      'items-center justify-center p-4',
      className,
    )}
    {...props}
  >
    {children ?? (
      <Text className="text-sm text-muted-foreground">No attachments</Text>
    )}
  </View>
);
