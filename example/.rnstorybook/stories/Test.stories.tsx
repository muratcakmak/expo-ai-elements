import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View, Text } from 'react-native';

const TestComponent = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hello Storybook!</Text>
    <Text style={{ marginTop: 8, color: '#666' }}>If you see this, Storybook works.</Text>
  </View>
);

const meta: Meta<typeof TestComponent> = {
  title: 'Test/Hello',
  component: TestComponent,
};
export default meta;

type Story = StoryObj<typeof TestComponent>;

export const Default: Story = {};
