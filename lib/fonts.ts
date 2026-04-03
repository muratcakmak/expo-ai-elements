import { Platform } from 'react-native';

const MONO_FONT_FAMILY = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const MONO_STYLE = { fontFamily: MONO_FONT_FAMILY } as const;
