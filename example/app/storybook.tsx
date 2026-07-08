import React from 'react';
import { View } from 'react-native';

import StorybookUIRoot from '../.rnstorybook';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

/**
 * Mounts the on-device Storybook UI full-screen.
 *
 * `../.rnstorybook` default-exports the `StorybookUIRoot` built by
 * `view.getStorybookUI(...)` in `.rnstorybook/index.ts`.
 */
export default function StorybookScreen() {
  return (
    <View style={{ flex: 1 }}>
      <DemoErrorBoundary label="Storybook failed to mount">
        <StorybookUIRoot />
      </DemoErrorBoundary>
    </View>
  );
}
