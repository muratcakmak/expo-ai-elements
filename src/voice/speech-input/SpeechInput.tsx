import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View, type PressableProps } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { Mic, Square } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import { Spinner } from '../../primitives/Spinner';
import { colors } from '../../theme/tokens';

/* --------------------------------- Types --------------------------------- */

type SpeechInputMode = 'speech-recognition' | 'none';

type SpeechInputProps = PressableProps & {
  className?: string;
  /** Called whenever a final transcription result is received. */
  onTranscriptionChange?: (text: string) => void;
  /**
   * Fallback callback for when recording completes.
   * Receives the audio file URI for external transcription.
   * Should return the transcribed text.
   */
  onAudioRecorded?: (audioUri: string) => Promise<string>;
  /** BCP-47 language tag. Defaults to "en-US". */
  lang?: string;
};

/* ----------------------------- Detection --------------------------------- */

/**
 * Detect whether expo-speech-recognition is available on the device.
 * Returns "speech-recognition" if available, "none" otherwise.
 */
const detectSpeechInputMode = (): SpeechInputMode => {
  try {
    // expo-speech-recognition is available if the module exists
    if (ExpoSpeechRecognitionModule) {
      return 'speech-recognition';
    }
  } catch {
    // Module not installed or not linked
  }
  return 'none';
};

/* ------------------------------ PulseRing -------------------------------- */

const PulseRing = ({ delay }: { delay: number }) => {
  // Lazily create stable Animated.Values via useState so we never read a ref
  // during render (react-hooks/refs).
  const [opacity] = useState(() => new Animated.Value(0.4));
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.8,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    animation.start();

    return () => {
      animation.stop();
      opacity.setValue(0.4);
      scale.setValue(1);
    };
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      style={{ opacity, transform: [{ scale }] }}
      className="absolute h-full w-full rounded-full border-2 border-destructive/30"
    />
  );
};

/* ------------------------------ Component -------------------------------- */

function SpeechInput({
  className,
  onTranscriptionChange,
  onAudioRecorded,
  lang = 'en-US',
  ...props
}: SpeechInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode] = useState<SpeechInputMode>(detectSpeechInputMode);

  const onTranscriptionChangeRef = useRef(onTranscriptionChange);
  const onAudioRecordedRef = useRef(onAudioRecorded);

  // Keep refs in sync after each render (refs must not be mutated during render).
  useEffect(() => {
    onTranscriptionChangeRef.current = onTranscriptionChange;
    onAudioRecordedRef.current = onAudioRecorded;
  });

  /* ---- expo-speech-recognition event hooks ---- */

  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    if (event.isFinal && event.results.length > 0) {
      const transcript = event.results[0]?.transcript ?? '';
      if (transcript) {
        onTranscriptionChangeRef.current?.(transcript);
      }
    }
  });

  useSpeechRecognitionEvent('error', () => {
    setIsListening(false);
  });

  /* Handle audio URI callback when recording completes */
  useSpeechRecognitionEvent('audioend', async (event) => {
    if (onAudioRecordedRef.current && event.uri) {
      setIsProcessing(true);
      try {
        const transcript = await onAudioRecordedRef.current(event.uri);
        if (transcript) {
          onTranscriptionChangeRef.current?.(transcript);
        }
      } catch {
        // Error handling delegated to the onAudioRecorded caller
      } finally {
        setIsProcessing(false);
      }
    }
  });

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (isListening) {
        ExpoSpeechRecognitionModule.stop();
      }
    },
    [isListening],
  );

  /* ---- Toggle ---- */

  const toggleListening = useCallback(async () => {
    if (mode !== 'speech-recognition') {
      return;
    }

    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      // Request permissions first
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        return;
      }

      ExpoSpeechRecognitionModule.start({
        lang,
        interimResults: true,
        continuous: true,
        recordingOptions: onAudioRecordedRef.current
          ? { persist: true }
          : undefined,
      });
    }
  }, [mode, isListening, lang]);

  const isDisabled = mode === 'none' || isProcessing;

  return (
    <View className="relative items-center justify-center">
      {/* Animated pulse rings */}
      {isListening &&
        [0, 1, 2].map((index) => (
          <PulseRing key={index} delay={index * 300} />
        ))}

      {/* Main record button */}
      <Button
        className={cn(
          'relative z-10 rounded-full',
          isListening
            ? 'bg-destructive'
            : 'bg-primary',
          className,
        )}
        disabled={isDisabled}
        onPress={toggleListening}
        accessibilityLabel={
          isListening ? 'Stop recording' : 'Start recording'
        }
        accessibilityRole="button"
        accessibilityState={{ busy: isProcessing }}
        {...props}
      >
        {isProcessing && <Spinner size="small" color={colors.primaryForeground} />}
        {!isProcessing && isListening && (
          <Square size={16} color={colors.primaryForeground} />
        )}
        {!(isProcessing || isListening) && (
          <Mic size={16} color={colors.primaryForeground} />
        )}
      </Button>
    </View>
  );
}

export {
  SpeechInput,
  detectSpeechInputMode,
  type SpeechInputProps,
  type SpeechInputMode,
};
