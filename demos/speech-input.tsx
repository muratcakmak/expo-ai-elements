import { SpeechInput } from '@/components/ai';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

const FAKE_TRANSCRIPTS = [
  'Hello, how can I help you today?',
  'I need to build a React Native app with authentication.',
  'Can you explain how to use Expo Router?',
];

export function SpeechInputDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = useCallback(() => {
    setIsRecording((prev) => {
      if (prev) {
        // Stopping: simulate a transcription result
        const randomIndex = Math.floor(Math.random() * FAKE_TRANSCRIPTS.length);
        setTranscript(FAKE_TRANSCRIPTS[randomIndex]);
      } else {
        // Starting: clear previous transcript
        setTranscript('');
      }
      return !prev;
    });
  }, []);

  // Auto-stop after 5 seconds of "recording"
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setTimeout(() => {
        setIsRecording(false);
        const randomIndex = Math.floor(Math.random() * FAKE_TRANSCRIPTS.length);
        setTranscript(FAKE_TRANSCRIPTS[randomIndex]);
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRecording]);

  return (
    <View className="gap-6">
      <PreviewSection
        title="Interactive recording"
        description="Tap to record, shows pulse animation, tap to stop with fake transcription"
      >
        <View className="items-center gap-4">
          <SpeechInput
            isRecording={isRecording}
            onToggleRecording={handleToggle}
          />
          {isRecording && (
            <Text className="text-destructive text-sm font-medium">
              Recording... tap to stop
            </Text>
          )}
          {!isRecording && transcript ? (
            <View className="bg-muted/50 w-full rounded-lg p-3">
              <Text className="text-muted-foreground text-xs font-medium">Transcript:</Text>
              <Text className="mt-1 text-sm">{transcript}</Text>
            </View>
          ) : null}
          {!isRecording && !transcript && (
            <Text className="text-muted-foreground text-sm">
              Tap the microphone to start speaking
            </Text>
          )}
        </View>
      </PreviewSection>

      <PreviewSection title="Recording state" description="Pulsing animation while active">
        <View className="items-center">
          <SpeechInput isRecording />
        </View>
      </PreviewSection>
    </View>
  );
}
