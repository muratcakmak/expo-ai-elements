/**
 * Voice & Media components barrel export.
 *
 * OMC-70: AudioPlayer — expo-audio based audio playback with compound controls
 * OMC-71: SpeechInput — expo-speech-recognition based speech-to-text input
 * OMC-72: Transcription — Streaming transcription display with timestamps
 * OMC-73: MicSelector — Audio input device picker using expo-audio
 * OMC-74: VoiceSelector — Voice list picker with audio preview
 * OMC-75: Persona — Rive animation persona with static image fallback
 */

// OMC-70: AudioPlayer
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
} from './audio-player/AudioPlayer';

// OMC-71: SpeechInput
export {
  SpeechInput,
  detectSpeechInputMode,
  type SpeechInputProps,
  type SpeechInputMode,
} from './speech-input/SpeechInput';

// OMC-72: Transcription
export {
  Transcription,
  TranscriptionSegmentView,
  TranscriptionTimestamp,
  useTranscription,
  type TranscriptionProps,
  type TranscriptionSegment,
  type TranscriptionSegmentViewProps,
  type TranscriptionTimestampProps,
} from './transcription/Transcription';

// OMC-73: MicSelector
export {
  MicSelector,
  MicSelectorTrigger,
  MicSelectorValue,
  MicSelectorLabel,
  useAudioDevices,
  useMicSelector,
  type MicSelectorProps,
  type MicSelectorTriggerProps,
  type MicSelectorValueProps,
  type MicSelectorLabelProps,
  type AudioInputDevice,
} from './mic-selector/MicSelector';

// OMC-74: VoiceSelector
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
} from './voice-selector/VoiceSelector';

// OMC-75: Persona
export {
  Persona,
  personaSources,
  type PersonaProps,
  type PersonaState,
  type PersonaVariant,
} from './persona/Persona';
