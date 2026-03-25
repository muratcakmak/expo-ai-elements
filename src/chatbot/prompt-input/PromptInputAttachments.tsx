import { X } from 'lucide-react-native';
import {
  Image,
  Pressable,
  Text,
  View,
  type ViewProps,
} from 'react-native';

import { cn } from '../../utils/cn';
import {
  matchesAccept,
  usePromptInputAttachments,
  type NativeFile,
} from './PromptInput';

// ============================================================================
// PromptInputAttachments — displays attached files in the input area
// ============================================================================

export type PromptInputAttachmentsProps = ViewProps & {
  className?: string;
  /** Size of image thumbnails in pixels. Default: 56 */
  thumbnailSize?: number;
};

export const PromptInputAttachments = ({
  className,
  thumbnailSize = 56,
  ...props
}: PromptInputAttachmentsProps) => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <View
      className={cn('flex-row flex-wrap gap-2 px-3 pt-2', className)}
      {...props}
    >
      {attachments.files.map((file) => (
        <PromptInputAttachmentItem
          key={file.id}
          file={file}
          thumbnailSize={thumbnailSize}
          onRemove={() => attachments.remove(file.id)}
        />
      ))}
    </View>
  );
};

// ============================================================================
// Single Attachment Item
// ============================================================================

type PromptInputAttachmentItemProps = {
  file: { id: string; filename: string; mediaType: string; url: string };
  thumbnailSize: number;
  onRemove: () => void;
};

const PromptInputAttachmentItem = ({
  file,
  thumbnailSize,
  onRemove,
}: PromptInputAttachmentItemProps) => {
  const isImage = file.mediaType.startsWith('image/');

  return (
    <View className="relative">
      {isImage ? (
        <Image
          source={{ uri: file.url }}
          style={{ width: thumbnailSize, height: thumbnailSize }}
          className="rounded-md"
          accessibilityLabel={file.filename}
        />
      ) : (
        <View
          style={{ width: thumbnailSize, height: thumbnailSize }}
          className="items-center justify-center rounded-md bg-muted"
        >
          <Text
            className="text-[10px] text-muted-foreground"
            numberOfLines={1}
          >
            {getExtension(file.filename)}
          </Text>
        </View>
      )}
      <Pressable
        accessibilityLabel={`Remove ${file.filename}`}
        accessibilityRole="button"
        className="absolute -right-1.5 -top-1.5 items-center justify-center rounded-full bg-destructive p-0.5"
        onPress={onRemove}
      >
        <X size={10} color="#fff" />
      </Pressable>
    </View>
  );
};

const getExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.at(-1)?.toUpperCase()}` : '?';
};

// ============================================================================
// File Picker Helpers
// ============================================================================

/**
 * Opens the system document picker using expo-document-picker.
 * Returns an array of NativeFile objects.
 *
 * Usage:
 * ```ts
 * import * as DocumentPicker from 'expo-document-picker';
 * const files = await pickDocuments({ accept: 'image/*', multiple: true });
 * attachments.add(files);
 * ```
 */
export const pickDocuments = async (options?: {
  accept?: string;
  multiple?: boolean;
}): Promise<NativeFile[]> => {
  // Dynamically import to avoid hard dependency — user must install expo-document-picker
  const DocumentPicker = await import('expo-document-picker');
  const result = await DocumentPicker.getDocumentAsync({
    multiple: options?.multiple ?? false,
    type: options?.accept ?? '*/*',
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => ({
    mimeType: asset.mimeType ?? 'application/octet-stream',
    name: asset.name,
    size: asset.size,
    uri: asset.uri,
  }));
};

/**
 * Opens the system image picker using expo-image-picker.
 * Returns an array of NativeFile objects.
 */
export const pickImages = async (options?: {
  multiple?: boolean;
}): Promise<NativeFile[]> => {
  const ImagePicker = await import('expo-image-picker');
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: options?.multiple ?? false,
    mediaTypes: ['images'],
    quality: 0.8,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => ({
    mimeType: asset.mimeType ?? 'image/jpeg',
    name: asset.fileName ?? `image-${Date.now()}.jpg`,
    size: asset.fileSize,
    uri: asset.uri,
  }));
};

/**
 * Validates a list of native files against accept, maxFiles, and maxFileSize constraints.
 * Returns the files that pass validation and calls onError for any violations.
 */
export const validateFiles = (
  files: NativeFile[],
  options: {
    accept?: string;
    maxFiles?: number;
    maxFileSize?: number;
    currentCount?: number;
    onError?: (err: {
      code: 'max_files' | 'max_file_size' | 'accept';
      message: string;
    }) => void;
  },
): NativeFile[] => {
  const { accept, maxFiles, maxFileSize, currentCount = 0, onError } = options;

  // Filter by accept pattern
  const accepted = files.filter((f) => matchesAccept(f.mimeType, accept));
  if (files.length > 0 && accepted.length === 0) {
    onError?.({
      code: 'accept',
      message: 'No files match the accepted types.',
    });
    return [];
  }

  // Filter by size
  const withinSize = maxFileSize
    ? accepted.filter((f) => !f.size || f.size <= maxFileSize)
    : accepted;
  if (accepted.length > 0 && withinSize.length === 0) {
    onError?.({
      code: 'max_file_size',
      message: 'All files exceed the maximum size.',
    });
    return [];
  }

  // Cap to maxFiles
  if (typeof maxFiles === 'number') {
    const capacity = Math.max(0, maxFiles - currentCount);
    const capped = withinSize.slice(0, capacity);
    if (withinSize.length > capacity) {
      onError?.({
        code: 'max_files',
        message: 'Too many files. Some were not added.',
      });
    }
    return capped;
  }

  return withinSize;
};
