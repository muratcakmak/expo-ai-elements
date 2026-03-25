module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // reanimated plugin MUST be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
