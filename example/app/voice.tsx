import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
} from '../../src/voice/audio-player/AudioPlayer';
import {
  MicSelector,
  MicSelectorTrigger,
  MicSelectorValue,
} from '../../src/voice/mic-selector/MicSelector';
import { SpeechInput } from '../../src/voice/speech-input/SpeechInput';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

// Royalty-free test track (SoundHelix — free to use).
const SAMPLE_MP3 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: '800' }}>{title}</Text>
      {children}
    </View>
  );
}

export default function VoiceScreen() {
  // MicSelector requests mic permission on mount and SpeechInput registers
  // recognition listeners, so both stay behind an explicit tap-to-mount.
  const [permissionMounted, setPermissionMounted] = useState(false);
  const [transcript, setTranscript] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: '900' }}>Voice</Text>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            AudioPlayer (remote mp3), MicSelector + SpeechInput (tap to mount)
          </Text>
        </View>

        <Section title="AudioPlayer (remote mp3)">
          <DemoErrorBoundary label="AudioPlayer failed">
            <AudioPlayer src={SAMPLE_MP3}>
              <AudioPlayerControlBar>
                <AudioPlayerSeekBackwardButton />
                <AudioPlayerPlayButton />
                <AudioPlayerSeekForwardButton />
                <AudioPlayerTimeRange />
                <AudioPlayerMuteButton />
              </AudioPlayerControlBar>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AudioPlayerTimeDisplay />
                <AudioPlayerDurationDisplay />
              </View>
            </AudioPlayer>
          </DemoErrorBoundary>
        </Section>

        <Section title="Permission-gated components">
          {!permissionMounted ? (
            <Pressable
              onPress={() => setPermissionMounted(true)}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#111',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                Mount MicSelector + SpeechInput
              </Text>
            </Pressable>
          ) : (
            <DemoErrorBoundary label="Mic / SpeechInput failed">
              <View style={{ gap: 16 }}>
                <MicSelector>
                  <MicSelectorTrigger>
                    <MicSelectorValue placeholder="Select microphone..." />
                  </MicSelectorTrigger>
                </MicSelector>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <SpeechInput onTranscriptionChange={setTranscript} />
                  <Text style={{ flex: 1, color: '#374151' }}>
                    {transcript || 'Tap the mic and speak to transcribe.'}
                  </Text>
                </View>
              </View>
            </DemoErrorBoundary>
          )}
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
