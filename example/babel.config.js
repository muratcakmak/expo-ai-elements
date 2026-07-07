module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Bundle mode is REQUIRED by react-native-streamdown: remend ships a
      // minified dist that classic workletization cannot process (yields
      // "[Worklets] Tried to synchronously call a Remote Function").
      // The uniwind/worklets react-native shim conflict is arbitrated in
      // metro.config.js.
      //
      // NOTE: streamdown's README documents `workletizableModules: ['remend']`,
      // but that option DOES NOT EXIST in react-native-worklets 0.10.0 — it was
      // renamed to `importForwarding.moduleNames`. With the old (ignored) name,
      // `remend` was captured as a JS-thread closure variable inside the worklet
      // (-> "Tried to synchronously call a Remote Function"). Listing it under
      // importForwarding.moduleNames makes the generated worklet emit a real
      // `import remend from 'remend'` that is resolved/bundled on the worklet
      // runtime instead. See node_modules/react-native-worklets/plugin/index.js
      // canForwardModuleImport() + the moduleBindingsToImport branch.
      ['react-native-worklets/plugin', { bundleMode: true, importForwarding: { moduleNames: ['remend'] } }],
    ],
  };
};
