import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../src/primitives/Accordion';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '../../../src/primitives/InputGroup';
import { Snippet } from '../../../src/code/snippet/Snippet';

/**
 * Primitives (extras) — quick-win primitives that complement the base
 * Primitives.stories.tsx (which already covers Button, Badge, Card, Progress,
 * Spinner, Separator, and Collapsible). This file adds Accordion, Snippet, and
 * InputGroup so the sidebar exercises the rest of the primitive layer without
 * duplicating the existing stories.
 */

const meta: Meta = {
  title: 'Primitives/Extras',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 24, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const AccordionStory: StoryObj = {
  name: 'Accordion — single',
  render: () => (
    <Accordion type="single" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111' }}>
            Is it accessible?
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
            Yes. It follows the WAI-ARIA disclosure pattern and exposes expanded
            state to assistive tech.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111' }}>
            Is it animated?
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
            The chevron rotates on toggle; content mounts/unmounts on open.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SnippetStory: StoryObj = {
  name: 'Snippet — copyable command',
  render: () => (
    <View style={{ gap: 12 }}>
      <Snippet code="npx expo install expo-ai-elements" />
      <Snippet code="bun add react-native-streamdown remend" />
    </View>
  ),
};

export const InputGroupStory: StoryObj = {
  name: 'InputGroup — textarea + addon',
  render: () => (
    <InputGroup>
      <InputGroupTextarea placeholder="Type a message…" />
      <InputGroupAddon align="end">
        <InputGroupButton>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#2563eb' }}>Send</Text>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
