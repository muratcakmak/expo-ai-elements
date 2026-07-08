module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo auto-registers its OWN react-native-worklets/plugin (and,
    // via the reanimated branch, reanimated/plugin which re-exports the same
    // worklets plugin) with NO options — there is no guard that turns that second
    // instance into a no-op (verified in babel-preset-expo/build/configs/expo.js).
    // A second optionless worklets instance would run WITHOUT bundleMode and clash
    // with ours. Disable the preset's auto-registration entirely so only our
    // bundle-mode instance below runs. BOTH flags are required: worklets:false
    // alone still falls into the branch that registers reanimated/plugin (which
    // re-exports the worklets plugin optionless).
    presets: [['babel-preset-expo', { worklets: false, reanimated: false }]],
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
