import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Generate a platform-aware URL for API routes.
 *
 * On web the relative path works as-is. On native we need an
 * absolute URL because there is no implicit origin. In development the
 * origin is derived from the Metro host (`Constants.expoConfig.hostUri`),
 * which handles non-default ports and physical devices, falling back to
 * localhost:8081.
 *
 * @param relativePath  e.g. "/api/chat"
 * @param baseUrl       Override for the API host
 */
export function generateAPIUrl(
  relativePath: string,
  baseUrl?: string,
): string {
  if (Platform.OS === 'web') {
    return relativePath;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const origin =
    baseUrl ?? (hostUri ? `http://${hostUri}` : 'http://localhost:8081');
  const cleanOrigin = origin.replace(/\/+$/, '');
  const cleanPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`;

  return `${cleanOrigin}${cleanPath}`;
}
