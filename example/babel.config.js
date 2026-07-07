module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Must be last (react-native-streamdown 0.2.0 requirement)
      ['react-native-worklets/plugin', { bundleMode: true, workletizableModules: ['remend'] }],
    ],
  };
};
