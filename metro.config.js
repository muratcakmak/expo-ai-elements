const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add streamdown worklet watch folders
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'node_modules/streamdown'),
  path.resolve(__dirname, 'node_modules/@streamdown'),
];

module.exports = withUniwindConfig(config, { cssEntryFile: './global.css' });
