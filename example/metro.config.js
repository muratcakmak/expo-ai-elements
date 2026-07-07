const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const { getBundleModeMetroConfig } = require('react-native-worklets/bundleMode');
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
];
config.resolver.extraNodeModules = Object.fromEntries(
  singletonModules.map((name) => [name, path.resolve(__dirname, 'node_modules', name)]),
);
// NOTE: extraNodeModules is only a *fallback* in metro-resolver (hierarchical
// node_modules lookup runs first — see metro-resolver/src/resolve.js), so on its
// own it would not stop ../src files from finding the root copies. The
// resolveRequest below re-anchors singleton imports at the example app so the
// standard resolver picks the example/node_modules copy.

// worklets bundle mode (react-native-streamdown requirement)
config.watchFolders.push(path.resolve(__dirname, 'node_modules/react-native-worklets/.worklets'));
const defaultResolver = config.resolver.resolveRequest;
config = getBundleModeMetroConfig(config);
const bundleModeResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('react-native-worklets/.worklets/')) {
    return bundleModeResolver(context, moduleName, platform);
  }
  // Force singleton modules (and their subpath imports) to the example app's
  // copy by re-running standard resolution anchored inside the example dir.
  const isSingleton = singletonModules.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
  if (isSingleton) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(__dirname, 'package.json') },
      moduleName,
      platform,
    );
  }
  if (defaultResolver) return defaultResolver(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, { cssEntryFile: './global.css' });
