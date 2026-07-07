const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const { getBundleModeMetroConfig } = require('react-native-worklets/bundleMode');
const { resolve: metroResolve } = require('metro-resolver');
const path = require('path');

let config = getDefaultConfig(__dirname);

// monorepo-ish resolution: library source lives one level up
const monorepoRoot = path.resolve(__dirname, '..');
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Force singletons: library source (../src) would otherwise resolve these from the
// root node_modules via hierarchical lookup, producing duplicate native/JS copies
// (e.g. two reanimated/worklets runtimes, a second BottomSheetModalProvider context).
// Map them all to the example app's copies.
const singletonModules = [
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  '@gorhom/bottom-sheet',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-svg',
  'react-native-webview',
  'expo',
  'expo-modules-core',
  'react-native-streamdown',
  'react-native-enriched-markdown',
  'remend',
  // Native modules the library source imports — same dual-copy hazard
  '@react-native-community/slider',
  '@react-native-community/datetimepicker',
  'expo-audio',
  'expo-clipboard',
  'expo-image',
  'expo-image-picker',
  'expo-document-picker',
  'expo-speech-recognition',
  'expo-linking',
  'expo-font',
  'expo-constants',
  'expo-file-system',
];
config.resolver.extraNodeModules = Object.fromEntries(
  singletonModules.map((name) => [name, path.resolve(__dirname, 'node_modules', name)]),
);
// NOTE: extraNodeModules is only a *fallback* in metro-resolver (hierarchical
// node_modules lookup runs first — see metro-resolver/src/resolve.js), so on its
// own it would not stop ../src files from finding the root copies. The
// resolveRequest below re-anchors singleton imports at the example app so the
// standard resolver picks the example/node_modules copy.

const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force singleton modules (and their subpath imports) to the example app's
  // copy by re-running standard resolution anchored inside the example dir.
  const isSingleton = singletonModules.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
  if (isSingleton) {
    // Resolve with metro-resolver directly (custom chain stripped): re-entering
    // context.resolveRequest from INSIDE the bundle-mode wrapper resolves
    // against the wrong inner resolver.
    return metroResolve(
      {
        ...context,
        originModulePath: path.join(__dirname, 'package.json'),
        resolveRequest: undefined,
      },
      moduleName,
      platform,
    );
  }
  if (defaultResolver) return defaultResolver(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

// worklets bundle mode (required by react-native-streamdown; captures the
// singleton redirect above as its inner fallback resolver)
config.watchFolders.push(path.resolve(__dirname, 'node_modules/react-native-worklets/.worklets'));
config = getBundleModeMetroConfig(config);

// uniwind wraps next (redirects app 'react-native' imports to its className
// wrapper components)
config = withUniwindConfig(config, { cssEntryFile: './global.css' });

// OUTERMOST — arbitrate the two react-native shims. Both uniwind and worklets
// bundle mode rewrite 'react-native' imports and each only exempts itself, so
// uniwind's wrapper components would receive the worklets shim, whose own
// 'react-native' import would receive uniwind's wrapper again -> infinite
// require cycle ("Maximum call stack size exceeded" at startup). Break the
// cycle at uniwind's internal link: uniwind's own modules always get the REAL
// react-native.
const composedResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native' &&
    context.originModulePath.includes(`${path.sep}node_modules${path.sep}uniwind${path.sep}`)
  ) {
    return metroResolve(
      {
        ...context,
        originModulePath: path.join(__dirname, 'package.json'),
        resolveRequest: undefined,
      },
      moduleName,
      platform,
    );
  }
  return composedResolver(context, moduleName, platform);
};

module.exports = config;
