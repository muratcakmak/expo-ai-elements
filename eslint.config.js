// Flat ESLint config for expo-ai-elements.
//
// This config uses `eslint-config-expo/flat` (the config Expo ships and that
// `expo lint` uses under the hood). ESLint and eslint-config-expo are NOT part
// of this branch's installed dependencies yet, so `bun run lint` will fail until
// they are added once:
//
//   bun add -d eslint eslint-config-expo
//
// (equivalent to `bun install eslint eslint-config-expo --dev`)
//
// After installing, `bunx eslint .` / `bun run lint` will work.

const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'ai-elements/**',
      'example/ios/**',
      'ios/**',
      'dist/**',
      'node_modules/**',
      '.expo/**',
      // Storybook stories are dev-only scaffolding (render-fn hooks trip
      // rules-of-hooks); exclude the whole directory from linting.
      'example/.rnstorybook/**',
    ],
  },
];
