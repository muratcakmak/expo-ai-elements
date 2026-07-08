import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  Check,
  Copy,
  File as FileIcon,
  GitCommit,
  Minus,
  Plus,
} from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* ---------------------------------- Root ---------------------------------- */

type CommitProps = ViewProps & {
  className?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

const Commit = ({ className, defaultOpen, children, ...props }: CommitProps) => (
  <Collapsible
    className={cn('rounded-lg border border-border bg-background', className)}
    defaultOpen={defaultOpen}
    {...props}
  >
    {children}
  </Collapsible>
);

/* --------------------------------- Header --------------------------------- */

type CommitHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitHeader = ({
  className,
  children,
  ...props
}: CommitHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex-row items-center justify-between gap-4 p-3',
      className,
    )}
    {...props}
  >
    {children}
  </CollapsibleTrigger>
);

/* ---------------------------------- Hash ---------------------------------- */

type CommitHashProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitHash = ({
  className,
  children,
  ...props
}: CommitHashProps) => (
  <View className={cn('flex-row items-center', className)} {...props}>
    <GitCommit size={12} className="mr-1 text-muted-foreground" />
    {typeof children === 'string' ? (
      <Text className="font-mono text-xs text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* -------------------------------- Message --------------------------------- */

type CommitMessageProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitMessage = ({
  className,
  children,
  ...props
}: CommitMessageProps) => (
  <Text className={cn('text-sm font-medium text-foreground', className)} {...props}>
    {children}
  </Text>
);

/* -------------------------------- Metadata -------------------------------- */

type CommitMetadataProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitMetadata = ({
  className,
  children,
  ...props
}: CommitMetadataProps) => (
  <View
    className={cn('flex-row items-center gap-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* ------------------------------- Separator -------------------------------- */

type CommitSeparatorProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitSeparator = ({
  className,
  children,
  ...props
}: CommitSeparatorProps) => (
  <Text className={cn('text-xs text-muted-foreground', className)} {...props}>
    {children ?? '\u2022'}
  </Text>
);

/* ---------------------------------- Info ---------------------------------- */

type CommitInfoProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitInfo = ({
  className,
  children,
  ...props
}: CommitInfoProps) => (
  <View className={cn('flex-1', className)} {...props}>
    {children}
  </View>
);

/* --------------------------------- Author --------------------------------- */

type CommitAuthorProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitAuthor = ({
  className,
  children,
  ...props
}: CommitAuthorProps) => (
  <View className={cn('flex-row items-center', className)} {...props}>
    {children}
  </View>
);

/* ----------------------------- Author Avatar ------------------------------ */

type CommitAuthorAvatarProps = ViewProps & {
  className?: string;
  initials: string;
};

const CommitAuthorAvatar = ({
  initials,
  className,
  ...props
}: CommitAuthorAvatarProps) => (
  <View
    className={cn(
      'h-8 w-8 items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  >
    <Text className="text-xs text-muted-foreground">{initials}</Text>
  </View>
);

/* -------------------------------- Timestamp -------------------------------- */

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const formatRelativeDate = (date: Date) => {
  const days = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return relativeTimeFormat.format(days, 'day');
};

type CommitTimestampProps = ViewProps & {
  className?: string;
  date: Date;
  children?: React.ReactNode;
};

const CommitTimestamp = ({
  date,
  className,
  children,
  ...props
}: CommitTimestampProps) => {
  // Derived directly from `date` during render — no effect/state needed, which
  // avoids the setState-in-effect cascading render.
  const formatted = formatRelativeDate(date);

  return (
    <View className={cn(className)} {...props}>
      <Text className="text-xs text-muted-foreground">
        {children ?? formatted}
      </Text>
    </View>
  );
};

/* -------------------------------- Actions --------------------------------- */

type CommitActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitActions = ({
  className,
  children,
  ...props
}: CommitActionsProps) => (
  <View
    className={cn('flex-row items-center gap-1', className)}
    {...props}
  >
    {children}
  </View>
);

/* ------------------------------ Copy Button ------------------------------- */

type CommitCopyButtonProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
  hash: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

const CommitCopyButton = ({
  hash,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CommitCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback(async () => {
    try {
      if (!isCopied) {
        await Clipboard.setStringAsync(hash);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [hash, onCopy, onError, timeout, isCopied]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const Icon = isCopied ? Check : Copy;

  return (
    <Pressable
      className={cn('h-7 w-7 shrink-0 items-center justify-center', className)}
      onPress={copyToClipboard}
      accessibilityRole="button"
      accessibilityLabel="Copy commit hash"
      {...props}
    >
      {children ?? <Icon size={14} className="text-muted-foreground" />}
    </Pressable>
  );
};

/* -------------------------------- Content --------------------------------- */

type CommitContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitContent = ({
  className,
  children,
  ...props
}: CommitContentProps) => (
  <CollapsibleContent
    className={cn('border-t border-border p-3', className)}
    {...props}
  >
    {children}
  </CollapsibleContent>
);

/* ---------------------------------- Files --------------------------------- */

type CommitFilesProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitFiles = ({
  className,
  children,
  ...props
}: CommitFilesProps) => (
  <View className={cn('gap-1', className)} {...props}>
    {children}
  </View>
);

/* ---------------------------------- File ---------------------------------- */

type CommitFileProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitFile = ({
  className,
  children,
  ...props
}: CommitFileProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between gap-2 rounded px-2 py-1',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* ------------------------------- File Info -------------------------------- */

type CommitFileInfoProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitFileInfo = ({
  className,
  children,
  ...props
}: CommitFileInfoProps) => (
  <View
    className={cn('flex-1 flex-row items-center gap-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* ----------------------------- File Status -------------------------------- */

const fileStatusStyles: Record<string, string> = {
  added: 'text-green-600 dark:text-green-400',
  deleted: 'text-red-600 dark:text-red-400',
  modified: 'text-yellow-600 dark:text-yellow-400',
  renamed: 'text-blue-600 dark:text-blue-400',
};

const fileStatusLabels: Record<string, string> = {
  added: 'A',
  deleted: 'D',
  modified: 'M',
  renamed: 'R',
};

type CommitFileStatusProps = ViewProps & {
  className?: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  children?: React.ReactNode;
};

const CommitFileStatus = ({
  status,
  className,
  children,
  ...props
}: CommitFileStatusProps) => (
  <View className={cn(className)} {...props}>
    <Text
      className={cn('font-mono text-xs font-medium', fileStatusStyles[status])}
    >
      {children ?? fileStatusLabels[status]}
    </Text>
  </View>
);

/* ------------------------------ File Icon --------------------------------- */

type CommitFileIconProps = ViewProps & {
  className?: string;
};

const CommitFileIcon = ({
  className,
  ...props
}: CommitFileIconProps) => (
  <View className={cn('shrink-0', className)} {...props}>
    <FileIcon size={14} className="text-muted-foreground" />
  </View>
);

/* ------------------------------ File Path --------------------------------- */

type CommitFilePathProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitFilePath = ({
  className,
  children,
  ...props
}: CommitFilePathProps) => (
  <Text
    className={cn('flex-1 font-mono text-xs text-foreground', className)}
    numberOfLines={1}
    {...props}
  >
    {children}
  </Text>
);

/* ----------------------------- File Changes ------------------------------- */

type CommitFileChangesProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const CommitFileChanges = ({
  className,
  children,
  ...props
}: CommitFileChangesProps) => (
  <View
    className={cn('shrink-0 flex-row items-center gap-1', className)}
    {...props}
  >
    {children}
  </View>
);

/* ----------------------------- File Additions ----------------------------- */

type CommitFileAdditionsProps = ViewProps & {
  className?: string;
  count: number;
  children?: React.ReactNode;
};

const CommitFileAdditions = ({
  count,
  className,
  children,
  ...props
}: CommitFileAdditionsProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <View className={cn('flex-row items-center', className)} {...props}>
      {children ?? (
        <>
          <Plus size={12} className="text-green-600 dark:text-green-400" />
          <Text className="font-mono text-xs text-green-600 dark:text-green-400">
            {count}
          </Text>
        </>
      )}
    </View>
  );
};

/* ----------------------------- File Deletions ----------------------------- */

type CommitFileDeletionsProps = ViewProps & {
  className?: string;
  count: number;
  children?: React.ReactNode;
};

const CommitFileDeletions = ({
  count,
  className,
  children,
  ...props
}: CommitFileDeletionsProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <View className={cn('flex-row items-center', className)} {...props}>
      {children ?? (
        <>
          <Minus size={12} className="text-red-600 dark:text-red-400" />
          <Text className="font-mono text-xs text-red-600 dark:text-red-400">
            {count}
          </Text>
        </>
      )}
    </View>
  );
};

export {
  Commit,
  CommitHeader,
  CommitHash,
  CommitMessage,
  CommitMetadata,
  CommitSeparator,
  CommitInfo,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitTimestamp,
  CommitActions,
  CommitCopyButton,
  CommitContent,
  CommitFiles,
  CommitFile,
  CommitFileInfo,
  CommitFileStatus,
  CommitFileIcon,
  CommitFilePath,
  CommitFileChanges,
  CommitFileAdditions,
  CommitFileDeletions,
  type CommitProps,
  type CommitHeaderProps,
  type CommitHashProps,
  type CommitMessageProps,
  type CommitMetadataProps,
  type CommitSeparatorProps,
  type CommitInfoProps,
  type CommitAuthorProps,
  type CommitAuthorAvatarProps,
  type CommitTimestampProps,
  type CommitActionsProps,
  type CommitCopyButtonProps,
  type CommitContentProps,
  type CommitFilesProps,
  type CommitFileProps,
  type CommitFileInfoProps,
  type CommitFileStatusProps,
  type CommitFileIconProps,
  type CommitFilePathProps,
  type CommitFileChangesProps,
  type CommitFileAdditionsProps,
  type CommitFileDeletionsProps,
};
