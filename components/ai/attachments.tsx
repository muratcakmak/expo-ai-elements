import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { X, File } from 'lucide-react-native';

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  uri?: string;
};

type AttachmentsProps = {
  attachments: Attachment[];
  onRemove?: (id: string) => void;
  className?: string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Attachments({ attachments, onRemove, className }: AttachmentsProps) {
  return (
    <View className={cn(className)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-1 py-1"
      >
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// --- Internal attachment item ---

type AttachmentItemProps = {
  attachment: Attachment;
  onRemove?: (id: string) => void;
};

function AttachmentItem({ attachment, onRemove }: AttachmentItemProps) {
  const isImage = attachment.type.startsWith('image/');

  return (
    <View className="bg-secondary/50 border-border relative overflow-hidden rounded-lg border" style={{ width: 120 }}>
      {/* Preview area */}
      {isImage && attachment.uri ? (
        <Image
          source={{ uri: attachment.uri }}
          className="h-16 w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="bg-muted h-16 items-center justify-center">
          <Icon as={File} className="text-muted-foreground size-6" />
        </View>
      )}

      {/* File info */}
      <View className="gap-0.5 px-2 py-1.5">
        <Text className="text-xs font-medium" numberOfLines={1}>
          {attachment.name}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {formatFileSize(attachment.size)}
        </Text>
      </View>

      {/* Remove button */}
      {onRemove ? (
        <Pressable
          onPress={() => onRemove(attachment.id)}
          className="bg-background/80 active:bg-background absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full"
        >
          <Icon as={X} className="text-muted-foreground size-3" />
        </Pressable>
      ) : null}
    </View>
  );
}

Attachments.displayName = 'Attachments';

export { Attachments };
export type { AttachmentsProps, Attachment };
