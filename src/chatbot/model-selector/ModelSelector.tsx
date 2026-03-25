import React from 'react';
import {
  Image,
  Text,
  View,
  type ImageProps,
  type TextProps,
  type ViewProps,
} from 'react-native';

import { cn } from '../../utils/cn';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '../../primitives/Dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from '../../primitives/Command';

/* ======================================================================== */
/* ModelSelector (Dialog root)                                                */
/* ======================================================================== */

export type ModelSelectorProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ModelSelector = (props: ModelSelectorProps) => (
  <Dialog {...props} />
);

/* ======================================================================== */
/* ModelSelectorTrigger                                                      */
/* ======================================================================== */

export type ModelSelectorTriggerProps = React.ComponentProps<typeof DialogTrigger>;

export const ModelSelectorTrigger = (props: ModelSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

/* ======================================================================== */
/* ModelSelectorContent                                                      */
/* ======================================================================== */

export type ModelSelectorContentProps = React.ComponentProps<typeof DialogContent> & {
  title?: React.ReactNode;
};

export const ModelSelectorContent = ({
  className,
  children,
  title = 'Model Selector',
  ...props
}: ModelSelectorContentProps) => (
  <DialogContent
    className={cn('p-0', className)}
    showCloseButton={false}
    {...props}
  >
    <DialogTitle>
      <Text className="sr-only">
        {typeof title === 'string' ? title : ''}
      </Text>
    </DialogTitle>
    <Command>{children}</Command>
  </DialogContent>
);

/* ======================================================================== */
/* ModelSelectorInput                                                        */
/* ======================================================================== */

export type ModelSelectorInputProps = React.ComponentProps<typeof CommandInput>;

export const ModelSelectorInput = ({
  className,
  ...props
}: ModelSelectorInputProps) => (
  <CommandInput className={cn(className)} {...props} />
);

/* ======================================================================== */
/* ModelSelectorList                                                          */
/* ======================================================================== */

export type ModelSelectorListProps = React.ComponentProps<typeof CommandList>;

export const ModelSelectorList = (props: ModelSelectorListProps) => (
  <CommandList {...props} />
);

/* ======================================================================== */
/* ModelSelectorEmpty                                                         */
/* ======================================================================== */

export type ModelSelectorEmptyProps = React.ComponentProps<typeof CommandEmpty>;

export const ModelSelectorEmpty = (props: ModelSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

/* ======================================================================== */
/* ModelSelectorGroup                                                         */
/* ======================================================================== */

export type ModelSelectorGroupProps = React.ComponentProps<typeof CommandGroup>;

export const ModelSelectorGroup = (props: ModelSelectorGroupProps) => (
  <CommandGroup {...props} />
);

/* ======================================================================== */
/* ModelSelectorItem                                                          */
/* ======================================================================== */

export type ModelSelectorItemProps = React.ComponentProps<typeof CommandItem>;

export const ModelSelectorItem = (props: ModelSelectorItemProps) => (
  <CommandItem {...props} />
);

/* ======================================================================== */
/* ModelSelectorSeparator                                                     */
/* ======================================================================== */

export type ModelSelectorSeparatorProps = React.ComponentProps<typeof CommandSeparator>;

export const ModelSelectorSeparator = (props: ModelSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

/* ======================================================================== */
/* ModelSelectorLogo                                                          */
/* ======================================================================== */

export type ModelSelectorLogoProps = Omit<ImageProps, 'source'> & {
  provider: string;
  className?: string;
};

export const ModelSelectorLogo = ({
  provider,
  className,
  ...props
}: ModelSelectorLogoProps) => (
  <Image
    {...props}
    accessibilityLabel={`${provider} logo`}
    className={cn('h-3 w-3', className)}
    source={{ uri: `https://models.dev/logos/${provider}.svg` }}
    style={{ width: 12, height: 12 }}
  />
);

/* ======================================================================== */
/* ModelSelectorLogoGroup                                                     */
/* ======================================================================== */

export type ModelSelectorLogoGroupProps = ViewProps & {
  className?: string;
};

export const ModelSelectorLogoGroup = ({
  className,
  ...props
}: ModelSelectorLogoGroupProps) => (
  <View
    className={cn('shrink-0 flex-row items-center', className)}
    {...props}
  />
);

/* ======================================================================== */
/* ModelSelectorName                                                          */
/* ======================================================================== */

export type ModelSelectorNameProps = TextProps & {
  className?: string;
};

export const ModelSelectorName = ({
  className,
  ...props
}: ModelSelectorNameProps) => (
  <Text
    className={cn('flex-1 text-left text-sm text-foreground', className)}
    numberOfLines={1}
    {...props}
  />
);
