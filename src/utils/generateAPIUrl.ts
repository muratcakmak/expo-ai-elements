import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Generate a platform-aware URL for API routes.
 *
 * On web a relative path works as-is. On native we need an absolute URL
 * because there is no implicit origin. An input that is already an absolute
 * URL is returned untouched on every platform. In development the origin is
 * derived from the Metro host (`Constants.expoConfig.hostUri`), which handles
 * non-default ports and physical devices.
 *
 * In release/production builds `hostUri` is undefined. If no `baseUrl` override
 * is supplied there is no API origin to fall back to, so we throw (in `__DEV__`
 * we `console.warn` and fall back to localhost) rather than silently pointing
 * requests at `localhost:8081`.
 *
 * @param relativePath  e.g. "/api/chat", or a full "https://..." URL
 * @param baseUrl       Override for the API host
 */
export function generateAPIUrl(
  relativePath: string,
  baseUrl?: string,
): string {
  // Already an absolute URL — resolvable everywhere, so pass it through
  // untouched instead of prefixing a native host in front of it.
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }

  if (Platform.OS === 'web') {
    return relativePath;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  let origin: string;
  if (baseUrl) {
    origin = baseUrl;
  } else if (envBaseUrl) {
    origin = envBaseUrl;
  } else if (hostUri) {
    origin = `http://${hostUri}`;
  } else if (!__DEV__) {
    // No Metro host in a production build and no override — fail loudly rather
    // than silently hitting localhost, which would never work on-device.
    throw new Error(
      'generateAPIUrl: no API origin in a production build — pass baseUrl or a full URL, or set EXPO_PUBLIC_API_BASE_URL',
    );
  } else {
    console.warn(
      'generateAPIUrl: no Metro host (Constants.expoConfig.hostUri is undefined); ' +
        'falling back to http://localhost:8081. Pass baseUrl or a full URL to target a real API.',
    );
    origin = 'http://localhost:8081';
  }

  const cleanOrigin = origin.replace(/\/+$/, '');
  const cleanPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`;

  return `${cleanOrigin}${cleanPath}`;
}
