import { Platform } from 'react-native';

/**
 * Generate a platform-aware URL for API routes.
 *
 * On web the relative path works as-is. On native we need an
 * absolute URL because there is no implicit origin.
 *
 * @param relativePath  e.g. "/api/chat"
 * @param baseUrl       Override for the API host (defaults to localhost:8081)
 */
export function generateAPIUrl(
  relativePath: string,
  baseUrl?: string,
): string {
  if (Platform.OS === 'web') {
    return relativePath;
  }

  const origin = baseUrl ?? 'http://localhost:8081';
  const cleanOrigin = origin.replace(/\/+$/, '');
  const cleanPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`;

  return `${cleanOrigin}${cleanPath}`;
}
