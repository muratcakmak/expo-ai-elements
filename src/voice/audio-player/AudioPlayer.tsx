import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Slider from '@react-native-community/slider';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import { colors } from '../../theme/tokens';

/* --------------------------------- Types --------------------------------- */

type AudioData = {
  base64: string;
  mediaType: string;
};

type AudioPlayerContextValue = {
  player: ReturnType<typeof useAudioPlayer>;
  status: ReturnType<typeof useAudioPlayerStatus>;
  isMuted: boolean;
  toggleMute: () => void;
};

/* -------------------------------- Context -------------------------------- */

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

function useAudioPlayerContext(): AudioPlayerContextValue {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error(
      'AudioPlayer compound components must be used within <AudioPlayer>.',
    );
  }
  return ctx;
}

/* ------------------------------ Helpers ---------------------------------- */

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/* --------------------------------- Root ---------------------------------- */

type AudioPlayerProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
} & (
    | { src: string }
    | { data: AudioData }
  );

function AudioPlayer({
  children,
  className,
  ...props
}: AudioPlayerProps) {
  const source =
    'src' in props
      ? props.src
      : `data:${props.data.mediaType};base64,${props.data.base64}`;

  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      player.volume = next ? 0 : 1;
      return next;
    });
  }, [player]);

  const contextValue = useMemo(
    () => ({ player, status, isMuted, toggleMute }),
    [player, status, isMuted, toggleMute],
  );

  // Strip data/src from View props
  const viewProps = { ...props } as Record<string, unknown>;
  delete viewProps.src;
  delete viewProps.data;

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      <View
        className={cn('flex-col gap-2', className)}
        accessibilityRole="adjustable"
        accessibilityLabel="Audio player"
        {...(viewProps as ViewProps)}
      >
        {children}
      </View>
    </AudioPlayerContext.Provider>
  );
}

/* ----------------------------- Control Bar ------------------------------- */

type AudioPlayerControlBarProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function AudioPlayerControlBar({
  children,
  className,
  ...props
}: AudioPlayerControlBarProps) {
  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      {...props}
    >
      {children}
    </View>
  );
}

/* ----------------------------- Play Button ------------------------------- */

type AudioPlayerPlayButtonProps = PressableProps & {
  className?: string;
};

function AudioPlayerPlayButton({
  className,
  ...props
}: AudioPlayerPlayButtonProps) {
  const { player, status } = useAudioPlayerContext();

  const isPlaying = status.playing;

  const handlePress = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, isPlaying]);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn(className)}
      onPress={handlePress}
      accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      accessibilityRole="button"
      {...props}
    >
      {isPlaying ? (
        <Pause size={16} color={colors.foreground} />
      ) : (
        <Play size={16} color={colors.foreground} />
      )}
    </Button>
  );
}

/* ------------------------- Seek Backward Button -------------------------- */

type AudioPlayerSeekBackwardButtonProps = PressableProps & {
  className?: string;
  seekOffset?: number;
};

function AudioPlayerSeekBackwardButton({
  className,
  seekOffset = 10,
  ...props
}: AudioPlayerSeekBackwardButtonProps) {
  const { player, status } = useAudioPlayerContext();

  const handlePress = useCallback(() => {
    const currentSec = status.currentTime / 1000;
    const newTime = Math.max(0, currentSec - seekOffset);
    player.seekTo(newTime);
  }, [player, status.currentTime, seekOffset]);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn(className)}
      onPress={handlePress}
      accessibilityLabel={`Seek backward ${seekOffset} seconds`}
      accessibilityRole="button"
      {...props}
    >
      <SkipBack size={16} color={colors.foreground} />
    </Button>
  );
}

/* -------------------------- Seek Forward Button -------------------------- */

type AudioPlayerSeekForwardButtonProps = PressableProps & {
  className?: string;
  seekOffset?: number;
};

function AudioPlayerSeekForwardButton({
  className,
  seekOffset = 10,
  ...props
}: AudioPlayerSeekForwardButtonProps) {
  const { player, status } = useAudioPlayerContext();

  const handlePress = useCallback(() => {
    const currentSec = status.currentTime / 1000;
    const durationSec = status.duration / 1000;
    const newTime = Math.min(durationSec, currentSec + seekOffset);
    player.seekTo(newTime);
  }, [player, status.currentTime, status.duration, seekOffset]);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn(className)}
      onPress={handlePress}
      accessibilityLabel={`Seek forward ${seekOffset} seconds`}
      accessibilityRole="button"
      {...props}
    >
      <SkipForward size={16} color={colors.foreground} />
    </Button>
  );
}

/* ------------------------------ Time Range ------------------------------- */

type AudioPlayerTimeRangeProps = ViewProps & {
  className?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
};

function AudioPlayerTimeRange({
  className,
  minimumTrackTintColor = colors.primary,
  maximumTrackTintColor = colors.border,
  thumbTintColor = colors.primary,
  ...props
}: AudioPlayerTimeRangeProps) {
  const { player, status } = useAudioPlayerContext();
  // State (not a ref) so the render reads a value that actually triggers
  // re-renders, and the slider becomes uncontrolled the moment a drag starts.
  const [isSeeking, setIsSeeking] = useState(false);

  const currentSec = status.currentTime / 1000;
  const durationSec = status.duration / 1000;

  const handleSlidingStart = useCallback(() => {
    setIsSeeking(true);
  }, []);

  const handleSlidingComplete = useCallback(
    (value: number) => {
      player.seekTo(value);
      setIsSeeking(false);
    },
    [player],
  );

  return (
    <View className={cn('flex-1', className)} {...props}>
      <Slider
        minimumValue={0}
        maximumValue={durationSec > 0 ? durationSec : 1}
        value={isSeeking ? undefined : currentSec}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        accessibilityLabel="Audio seek slider"
        accessibilityRole="adjustable"
      />
    </View>
  );
}

/* ----------------------------- Time Display ------------------------------ */

type AudioPlayerTimeDisplayProps = TextProps & {
  className?: string;
};

function AudioPlayerTimeDisplay({
  className,
  ...props
}: AudioPlayerTimeDisplayProps) {
  const { status } = useAudioPlayerContext();
  const currentSec = status.currentTime / 1000;

  return (
    <Text
      className={cn('text-xs tabular-nums text-foreground', className)}
      {...props}
    >
      {formatTime(currentSec)}
    </Text>
  );
}

/* --------------------------- Duration Display ---------------------------- */

type AudioPlayerDurationDisplayProps = TextProps & {
  className?: string;
};

function AudioPlayerDurationDisplay({
  className,
  ...props
}: AudioPlayerDurationDisplayProps) {
  const { status } = useAudioPlayerContext();
  const durationSec = status.duration / 1000;

  return (
    <Text
      className={cn('text-xs tabular-nums text-foreground', className)}
      {...props}
    >
      {formatTime(durationSec)}
    </Text>
  );
}

/* ----------------------------- Mute Button ------------------------------- */

type AudioPlayerMuteButtonProps = PressableProps & {
  className?: string;
};

function AudioPlayerMuteButton({
  className,
  ...props
}: AudioPlayerMuteButtonProps) {
  const { isMuted, toggleMute } = useAudioPlayerContext();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onPress={toggleMute}
      accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
      accessibilityRole="button"
      {...props}
    >
      {isMuted ? (
        <VolumeX size={16} color={colors.foreground} />
      ) : (
        <Volume2 size={16} color={colors.foreground} />
      )}
    </Button>
  );
}

/* ----------------------------- Volume Range ------------------------------ */

type AudioPlayerVolumeRangeProps = ViewProps & {
  className?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
};

function AudioPlayerVolumeRange({
  className,
  minimumTrackTintColor = colors.primary,
  maximumTrackTintColor = colors.border,
  thumbTintColor = colors.primary,
  ...props
}: AudioPlayerVolumeRangeProps) {
  const { player, isMuted } = useAudioPlayerContext();
  const [volume, setVolume] = useState(1);

  const handleValueChange = useCallback(
    (value: number) => {
      setVolume(value);
      // expo-audio's player is a mutable imperative object; assigning `.volume`
      // is its public API, not a React value mutation.
      // eslint-disable-next-line react-hooks/immutability
      player.volume = value;
    },
    [player],
  );

  return (
    <View className={cn('w-24', className)} {...props}>
      <Slider
        minimumValue={0}
        maximumValue={1}
        value={isMuted ? 0 : volume}
        onValueChange={handleValueChange}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        accessibilityLabel="Volume slider"
        accessibilityRole="adjustable"
      />
    </View>
  );
}

/* -------------------------------- Exports -------------------------------- */

export {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeRange,
  AudioPlayerTimeDisplay,
  AudioPlayerDurationDisplay,
  AudioPlayerMuteButton,
  AudioPlayerVolumeRange,
  useAudioPlayerContext,
  type AudioPlayerProps,
  type AudioPlayerControlBarProps,
  type AudioPlayerPlayButtonProps,
  type AudioPlayerSeekBackwardButtonProps,
  type AudioPlayerSeekForwardButtonProps,
  type AudioPlayerTimeRangeProps,
  type AudioPlayerTimeDisplayProps,
  type AudioPlayerDurationDisplayProps,
  type AudioPlayerMuteButtonProps,
  type AudioPlayerVolumeRangeProps,
};
