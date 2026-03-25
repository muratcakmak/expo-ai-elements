import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageProps,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { ChevronDown, Paperclip } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleContentProps,
} from '../../primitives/Collapsible';
import { ScrollArea } from '../../primitives/ScrollArea';

/* ======================================================================== */
/* Types                                                                     */
/* ======================================================================== */

export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'completed';
};

/* ======================================================================== */
/* QueueItem                                                                 */
/* ======================================================================== */

export type QueueItemProps = ViewProps & {
  className?: string;
};

export const QueueItem = ({ className, ...props }: QueueItemProps) => (
  <View
    className={cn(
      'flex-col gap-1 rounded-md px-3 py-1',
      className,
    )}
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemIndicator                                                        */
/* ======================================================================== */

export type QueueItemIndicatorProps = ViewProps & {
  className?: string;
  completed?: boolean;
};

export const QueueItemIndicator = ({
  completed = false,
  className,
  ...props
}: QueueItemIndicatorProps) => (
  <View
    className={cn(
      'mt-0.5 h-2.5 w-2.5 rounded-full border',
      completed
        ? 'border-muted-foreground/20 bg-muted-foreground/10'
        : 'border-muted-foreground/50',
      className,
    )}
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemContent                                                          */
/* ======================================================================== */

export type QueueItemContentProps = TextProps & {
  className?: string;
  completed?: boolean;
};

export const QueueItemContent = ({
  completed = false,
  className,
  ...props
}: QueueItemContentProps) => (
  <Text
    className={cn(
      'flex-1',
      completed
        ? 'text-muted-foreground/50 line-through'
        : 'text-muted-foreground',
      className,
    )}
    numberOfLines={1}
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemDescription                                                      */
/* ======================================================================== */

export type QueueItemDescriptionProps = ViewProps & {
  className?: string;
  completed?: boolean;
};

export const QueueItemDescription = ({
  completed = false,
  className,
  ...props
}: QueueItemDescriptionProps) => (
  <View
    className={cn(
      'ml-6',
      className,
    )}
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemActions                                                          */
/* ======================================================================== */

export type QueueItemActionsProps = ViewProps & {
  className?: string;
};

export const QueueItemActions = ({
  className,
  ...props
}: QueueItemActionsProps) => (
  <View className={cn('flex-row gap-1', className)} {...props} />
);

/* ======================================================================== */
/* QueueItemAction                                                           */
/* ======================================================================== */

export type QueueItemActionProps = Omit<ButtonProps, 'variant' | 'size'>;

export const QueueItemAction = ({
  className,
  ...props
}: QueueItemActionProps) => (
  <Button
    className={cn(
      'rounded p-1',
      className,
    )}
    size="icon"
    variant="ghost"
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemAttachment                                                       */
/* ======================================================================== */

export type QueueItemAttachmentProps = ViewProps & {
  className?: string;
};

export const QueueItemAttachment = ({
  className,
  ...props
}: QueueItemAttachmentProps) => (
  <View className={cn('mt-1 flex-row flex-wrap gap-2', className)} {...props} />
);

/* ======================================================================== */
/* QueueItemImage                                                            */
/* ======================================================================== */

export type QueueItemImageProps = ImageProps & {
  className?: string;
};

export const QueueItemImage = ({
  className,
  ...props
}: QueueItemImageProps) => (
  <Image
    className={cn('h-8 w-8 rounded border border-border', className)}
    resizeMode="cover"
    {...props}
  />
);

/* ======================================================================== */
/* QueueItemFile                                                             */
/* ======================================================================== */

export type QueueItemFileProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const QueueItemFile = ({
  children,
  className,
  ...props
}: QueueItemFileProps) => (
  <View
    className={cn(
      'flex-row items-center gap-1 rounded border border-border bg-muted px-2 py-1',
      className,
    )}
    {...props}
  >
    <Paperclip size={12} className="text-muted-foreground" />
    {typeof children === 'string' ? (
      <Text className="max-w-[100px] text-xs text-foreground" numberOfLines={1}>
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

/* ======================================================================== */
/* QueueList                                                                 */
/* ======================================================================== */

export type QueueListProps = ViewProps & {
  className?: string;
};

export const QueueList = ({
  children,
  className,
  ...props
}: QueueListProps) => (
  <ScrollArea className={cn('mt-2 -mb-1', className)} {...props}>
    <View className="max-h-40">
      {children}
    </View>
  </ScrollArea>
);

/* ======================================================================== */
/* QueueSection - collapsible section container                              */
/* ======================================================================== */

export type QueueSectionProps = CollapsibleProps;

export const QueueSection = ({
  className,
  defaultOpen = true,
  ...props
}: QueueSectionProps) => (
  <Collapsible className={cn(className)} defaultOpen={defaultOpen} {...props} />
);

/* ======================================================================== */
/* QueueSectionTrigger - section header/trigger                              */
/* ======================================================================== */

export type QueueSectionTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

export const QueueSectionTrigger = ({
  children,
  className,
  ...props
}: QueueSectionTriggerProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex-row w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2',
      className,
    )}
    {...props}
  >
    {children}
  </CollapsibleTrigger>
);

/* ======================================================================== */
/* QueueSectionLabel - label content with icon and count                     */
/* ======================================================================== */

export type QueueSectionLabelProps = ViewProps & {
  className?: string;
  count?: number;
  label: string;
  icon?: React.ReactNode;
};

export const QueueSectionLabel = ({
  count,
  label,
  icon,
  className,
  ...props
}: QueueSectionLabelProps) => (
  <View className={cn('flex-row items-center gap-2', className)} {...props}>
    <ChevronDown size={16} className="text-muted-foreground" />
    {icon}
    <Text className="text-sm font-medium text-muted-foreground">
      {count} {label}
    </Text>
  </View>
);

/* ======================================================================== */
/* QueueSectionContent - collapsible content area                            */
/* ======================================================================== */

export type QueueSectionContentProps = CollapsibleContentProps;

export const QueueSectionContent = ({
  className,
  ...props
}: QueueSectionContentProps) => (
  <CollapsibleContent className={cn(className)} {...props} />
);

/* ======================================================================== */
/* Queue - root container                                                    */
/* ======================================================================== */

export type QueueProps = ViewProps & {
  className?: string;
};

export const Queue = ({ className, ...props }: QueueProps) => (
  <View
    className={cn(
      'flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-sm',
      className,
    )}
    {...props}
  />
);
