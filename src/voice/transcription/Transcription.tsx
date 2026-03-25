import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type PressableProps,
  type ScrollViewProps,
  type TextProps,
  type ViewProps,
} from 'react-native';

import { cn } from '../../utils/cn';

/* --------------------------------- Types --------------------------------- */

type TranscriptionSegment = {
  text: string;
  startSecond: number;
  endSecond: number;
};

type TranscriptionContextValue = {
  segments: TranscriptionSegment[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek?: (time: number) => void;
};

/* -------------------------------- Context -------------------------------- */

const TranscriptionContext = createContext<TranscriptionContextValue | null>(
  null,
);

function useTranscription(): TranscriptionContextValue {
  const ctx = useContext(TranscriptionContext);
  if (!ctx) {
    throw new Error(
      'Transcription components must be used within <Transcription>.',
    );
  }
  return ctx;
}

/* --------------------------------- Root ---------------------------------- */

type TranscriptionProps = ScrollViewProps & {
  className?: string;
  segments: TranscriptionSegment[];
  currentTime?: number;
  onSeek?: (time: number) => void;
  children: (segment: TranscriptionSegment, index: number) => React.ReactNode;
  /** Auto-scroll to bottom when new segments arrive. Defaults to true. */
  autoScroll?: boolean;
};

function Transcription({
  segments,
  currentTime: externalCurrentTime,
  onSeek,
  className,
  children,
  autoScroll = true,
  ...props
}: TranscriptionProps) {
  const [internalTime, setInternalTime] = useState(0);
  const currentTime = externalCurrentTime ?? internalTime;
  const scrollViewRef = useRef<ScrollView>(null);

  const onTimeUpdate = useCallback(
    (time: number) => {
      setInternalTime(time);
      onSeek?.(time);
    },
    [onSeek],
  );

  // Auto-scroll when segments change
  useEffect(() => {
    if (autoScroll && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [segments.length, autoScroll]);

  const contextValue = useMemo(
    () => ({ currentTime, onSeek, onTimeUpdate, segments }),
    [currentTime, onSeek, onTimeUpdate, segments],
  );

  return (
    <TranscriptionContext.Provider value={contextValue}>
      <ScrollView
        ref={scrollViewRef}
        className={cn(className)}
        accessibilityRole="text"
        accessibilityLabel="Transcription"
        {...props}
      >
        <View className="flex-row flex-wrap gap-1">
          {segments
            .filter((segment) => segment.text.trim())
            .map((segment, index) => children(segment, index))}
        </View>
      </ScrollView>
    </TranscriptionContext.Provider>
  );
}

/* ----------------------------- Segment ----------------------------------- */

type TranscriptionSegmentViewProps = PressableProps & {
  className?: string;
  segment: TranscriptionSegment;
  index: number;
};

function TranscriptionSegmentView({
  segment,
  index,
  className,
  onPress,
  ...props
}: TranscriptionSegmentViewProps) {
  const { currentTime, onSeek } = useTranscription();

  const isActive =
    currentTime >= segment.startSecond && currentTime < segment.endSecond;
  const isPast = currentTime >= segment.endSecond;

  const handlePress = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (onSeek) {
        onSeek(segment.startSecond);
      }
      if (typeof onPress === 'function') {
        onPress(event);
      }
    },
    [onSeek, segment.startSecond, onPress],
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onSeek}
      accessibilityRole="button"
      accessibilityLabel={`Segment ${index + 1}: ${segment.text}`}
      accessibilityState={{ selected: isActive }}
      {...props}
    >
      <Text
        className={cn(
          'text-sm leading-relaxed',
          isActive && 'text-primary',
          isPast && 'text-muted-foreground',
          !(isActive || isPast) && 'text-muted-foreground/60',
          className,
        )}
      >
        {segment.text}
      </Text>
    </Pressable>
  );
}

/* ----------------------------- Timestamp --------------------------------- */

type TranscriptionTimestampProps = TextProps & {
  className?: string;
  seconds: number;
};

function TranscriptionTimestamp({
  seconds,
  className,
  ...props
}: TranscriptionTimestampProps) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <Text
      className={cn(
        'text-xs tabular-nums text-muted-foreground',
        className,
      )}
      {...props}
    >
      {formatted}
    </Text>
  );
}

/* -------------------------------- Exports -------------------------------- */

export {
  Transcription,
  TranscriptionSegmentView,
  TranscriptionTimestamp,
  useTranscription,
  type TranscriptionProps,
  type TranscriptionSegment,
  type TranscriptionSegmentViewProps,
  type TranscriptionTimestampProps,
};
