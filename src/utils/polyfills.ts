import { Platform } from 'react-native';

/**
 * Platform-conditional polyfills for React Native.
 *
 * - structuredClone is missing on Hermes (Android / iOS).
 * - TextEncoder / TextDecoder may be absent on older RN runtimes
 *   and are required by the AI SDK streaming transport.
 *
 * Import this file as early as possible in the app entry point.
 */

if (Platform.OS !== 'web') {
  // structuredClone polyfill for Hermes
  if (typeof globalThis.structuredClone === 'undefined') {
    require('@ungap/structured-clone');
  }

  // TextEncoder / TextDecoder polyfill
  if (
    typeof globalThis.TextEncoder === 'undefined' ||
    typeof globalThis.TextDecoder === 'undefined'
  ) {
    require('@stardazed/streams-text-encoding');
  }
}
