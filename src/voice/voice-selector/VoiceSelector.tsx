import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import { Spinner } from '../../primitives/Spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../primitives/Dialog';
import { colors } from '../../theme/tokens';

/* --------------------------------- Types --------------------------------- */

type GenderValue =
  | 'male'
  | 'female'
  | 'transgender'
  | 'androgyne'
  | 'non-binary'
  | 'intersex';

type AccentValue =
  | 'american'
  | 'british'
  | 'australian'
  | 'canadian'
  | 'irish'
  | 'scottish'
  | 'indian'
  | 'south-african'
  | 'new-zealand'
  | 'spanish'
  | 'french'
  | 'german'
  | 'italian'
  | 'portuguese'
  | 'brazilian'
  | 'mexican'
  | 'argentinian'
  | 'japanese'
  | 'chinese'
  | 'korean'
  | 'russian'
  | 'arabic'
  | 'dutch'
  | 'swedish'
  | 'norwegian'
  | 'danish'
  | 'finnish'
  | 'polish'
  | 'turkish'
  | 'greek'
  | string;

type VoiceSelectorContextValue = {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

/* -------------------------------- Context -------------------------------- */

const VoiceSelectorContext = createContext<VoiceSelectorContextValue | null>(
  null,
);

function useVoiceSelector(): VoiceSelectorContextValue {
  const ctx = useContext(VoiceSelectorContext);
  if (!ctx) {
    throw new Error(
      'VoiceSelector components must be used within <VoiceSelector>.',
    );
  }
  return ctx;
}

/* --------------------------------- Root ---------------------------------- */

type VoiceSelectorProps = {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function VoiceSelector({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: VoiceSelectorProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isValueControlled = valueProp !== undefined;
  const isOpenControlled = openProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;
  const open = isOpenControlled ? openProp : internalOpen;

  const setValue = useCallback(
    (nextValue: string | undefined) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange],
  );

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  const contextValue = useMemo(
    () => ({ value, setValue, open, setOpen }),
    [value, setValue, open, setOpen],
  );

  return (
    <VoiceSelectorContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </VoiceSelectorContext.Provider>
  );
}

/* -------------------------------- Trigger -------------------------------- */

type VoiceSelectorTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function VoiceSelectorTrigger(props: VoiceSelectorTriggerProps) {
  return <DialogTrigger {...props} />;
}

/* -------------------------------- Content -------------------------------- */

type VoiceSelectorContentProps = ViewProps & {
  className?: string;
  title?: string;
  children?: React.ReactNode;
};

function VoiceSelectorContent({
  className,
  children,
  title = 'Voice Selector',
  ...props
}: VoiceSelectorContentProps) {
  return (
    <DialogContent className={cn('p-0', className)} showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <View {...props}>{children}</View>
    </DialogContent>
  );
}

/* --------------------------------- List ---------------------------------- */

type VoiceSelectorListProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function VoiceSelectorList({
  className,
  children,
  ...props
}: VoiceSelectorListProps) {
  return (
    <View className={cn('max-h-96', className)} {...props}>
      {children}
    </View>
  );
}

/* --------------------------------- Empty --------------------------------- */

type VoiceSelectorEmptyProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function VoiceSelectorEmpty({
  className,
  children = <Text className="text-sm text-muted-foreground">No voices found.</Text>,
  ...props
}: VoiceSelectorEmptyProps) {
  return (
    <View
      className={cn('items-center justify-center p-4', className)}
      {...props}
    >
      {children}
    </View>
  );
}

/* --------------------------------- Group --------------------------------- */

type VoiceSelectorGroupProps = ViewProps & {
  className?: string;
  heading?: string;
  children?: React.ReactNode;
};

function VoiceSelectorGroup({
  className,
  heading,
  children,
  ...props
}: VoiceSelectorGroupProps) {
  return (
    <View className={cn(className)} {...props}>
      {heading ? (
        <Text className="px-4 py-2 text-xs font-medium text-muted-foreground">
          {heading}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

/* --------------------------------- Item ---------------------------------- */

type VoiceSelectorItemProps = PressableProps & {
  className?: string;
  value: string;
  children?: React.ReactNode;
};

function VoiceSelectorItem({
  className,
  value: itemValue,
  children,
  ...props
}: VoiceSelectorItemProps) {
  const { setValue, setOpen } = useVoiceSelector();

  const handlePress = useCallback(() => {
    setValue(itemValue);
    setOpen(false);
  }, [setValue, setOpen, itemValue]);

  return (
    <Pressable
      className={cn('flex-row items-center px-4 py-2', className)}
      onPress={handlePress}
      accessibilityRole="menuitem"
      {...props}
    >
      {children}
    </Pressable>
  );
}

/* -------------------------------- Separator ------------------------------- */

type VoiceSelectorSeparatorProps = ViewProps & {
  className?: string;
};

function VoiceSelectorSeparator({
  className,
  ...props
}: VoiceSelectorSeparatorProps) {
  return (
    <View className={cn('h-px bg-border', className)} {...props} />
  );
}

/* -------------------------------- Gender --------------------------------- */

type VoiceSelectorGenderProps = TextProps & {
  className?: string;
  value?: GenderValue;
};

const genderLabels: Record<GenderValue, string> = {
  male: 'Male',
  female: 'Female',
  transgender: 'Transgender',
  androgyne: 'Androgyne',
  'non-binary': 'Non-binary',
  intersex: 'Intersex',
};

function VoiceSelectorGender({
  className,
  value,
  children,
  ...props
}: VoiceSelectorGenderProps) {
  const label = value ? genderLabels[value] ?? value : '';

  return (
    <Text
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    >
      {children ?? label}
    </Text>
  );
}

/* -------------------------------- Accent --------------------------------- */

type VoiceSelectorAccentProps = TextProps & {
  className?: string;
  value?: AccentValue;
};

const accentLabels: Record<string, string> = {
  american: 'American',
  british: 'British',
  australian: 'Australian',
  canadian: 'Canadian',
  irish: 'Irish',
  scottish: 'Scottish',
  indian: 'Indian',
  'south-african': 'South African',
  'new-zealand': 'New Zealand',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  italian: 'Italian',
  portuguese: 'Portuguese',
  brazilian: 'Brazilian',
  mexican: 'Mexican',
  argentinian: 'Argentinian',
  japanese: 'Japanese',
  chinese: 'Chinese',
  korean: 'Korean',
  russian: 'Russian',
  arabic: 'Arabic',
  dutch: 'Dutch',
  swedish: 'Swedish',
  norwegian: 'Norwegian',
  danish: 'Danish',
  finnish: 'Finnish',
  polish: 'Polish',
  turkish: 'Turkish',
  greek: 'Greek',
};

function VoiceSelectorAccent({
  className,
  value,
  children,
  ...props
}: VoiceSelectorAccentProps) {
  const label = value ? accentLabels[value] ?? value : '';

  return (
    <Text
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    >
      {children ?? label}
    </Text>
  );
}

/* --------------------------------- Age ----------------------------------- */

type VoiceSelectorAgeProps = TextProps & {
  className?: string;
};

function VoiceSelectorAge({
  className,
  ...props
}: VoiceSelectorAgeProps) {
  return (
    <Text
      className={cn('text-xs tabular-nums text-muted-foreground', className)}
      {...props}
    />
  );
}

/* --------------------------------- Name ---------------------------------- */

type VoiceSelectorNameProps = TextProps & {
  className?: string;
};

function VoiceSelectorName({
  className,
  ...props
}: VoiceSelectorNameProps) {
  return (
    <Text
      className={cn('flex-1 text-left font-medium text-foreground', className)}
      numberOfLines={1}
      {...props}
    />
  );
}

/* ------------------------------ Description ------------------------------ */

type VoiceSelectorDescriptionProps = TextProps & {
  className?: string;
};

function VoiceSelectorDescription({
  className,
  ...props
}: VoiceSelectorDescriptionProps) {
  return (
    <Text
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

/* ----------------------------- Attributes -------------------------------- */

type VoiceSelectorAttributesProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function VoiceSelectorAttributes({
  className,
  children,
  ...props
}: VoiceSelectorAttributesProps) {
  return (
    <View
      className={cn('flex-row items-center gap-1', className)}
      {...props}
    >
      {children}
    </View>
  );
}

/* ------------------------------- Bullet ---------------------------------- */

type VoiceSelectorBulletProps = TextProps & {
  className?: string;
};

function VoiceSelectorBullet({
  className,
  ...props
}: VoiceSelectorBulletProps) {
  return (
    <Text
      className={cn('text-border', className)}
      accessibilityElementsHidden
      {...props}
    >
      {'\u2022'}
    </Text>
  );
}

/* ------------------------------- Preview --------------------------------- */

type VoiceSelectorPreviewProps = PressableProps & {
  className?: string;
  /** URI of the audio sample to preview. */
  sampleUri?: string;
  playing?: boolean;
  loading?: boolean;
  onPlay?: () => void;
};

function VoiceSelectorPreview({
  className,
  sampleUri,
  playing: externalPlaying,
  loading: externalLoading,
  onPlay,
  onPress,
  ...props
}: VoiceSelectorPreviewProps) {
  const player = useAudioPlayer(sampleUri ?? null);
  const playerStatus = useAudioPlayerStatus(player);

  const isPlaying = externalPlaying ?? playerStatus.playing;
  const isLoading = externalLoading ?? false;

  const handlePress = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      event.stopPropagation?.();

      if (sampleUri) {
        if (isPlaying) {
          player.pause();
        } else {
          player.seekTo(0);
          player.play();
        }
      }

      onPlay?.();
      if (typeof onPress === 'function') {
        onPress(event);
      }
    },
    [sampleUri, isPlaying, player, onPlay, onPress],
  );

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn('h-6 w-6', className)}
      disabled={isLoading}
      onPress={handlePress}
      accessibilityLabel={isPlaying ? 'Pause preview' : 'Play preview'}
      accessibilityRole="button"
      {...props}
    >
      {isLoading ? (
        <Spinner size="small" />
      ) : isPlaying ? (
        <Pause size={12} color={colors.foreground} />
      ) : (
        <Play size={12} color={colors.foreground} />
      )}
    </Button>
  );
}

/* -------------------------------- Exports -------------------------------- */

export {
  VoiceSelector,
  VoiceSelectorTrigger,
  VoiceSelectorContent,
  VoiceSelectorList,
  VoiceSelectorEmpty,
  VoiceSelectorGroup,
  VoiceSelectorItem,
  VoiceSelectorSeparator,
  VoiceSelectorGender,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorName,
  VoiceSelectorDescription,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorPreview,
  useVoiceSelector,
  type VoiceSelectorProps,
  type VoiceSelectorTriggerProps,
  type VoiceSelectorContentProps,
  type VoiceSelectorListProps,
  type VoiceSelectorEmptyProps,
  type VoiceSelectorGroupProps,
  type VoiceSelectorItemProps,
  type VoiceSelectorSeparatorProps,
  type VoiceSelectorGenderProps,
  type VoiceSelectorAccentProps,
  type VoiceSelectorAgeProps,
  type VoiceSelectorNameProps,
  type VoiceSelectorDescriptionProps,
  type VoiceSelectorAttributesProps,
  type VoiceSelectorBulletProps,
  type VoiceSelectorPreviewProps,
  type GenderValue,
  type AccentValue,
};
