import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import {
  PromptInput,
  type PromptInputMessage,
} from '../../../src/chatbot/prompt-input/PromptInput';
import { PromptInputSubmit } from '../../../src/chatbot/prompt-input/PromptInputSubmit';
import { PromptInputTextarea } from '../../../src/chatbot/prompt-input/PromptInputTextarea';
import { DemoErrorBoundary } from '../../components/DemoErrorBoundary';

/**
 * PromptInput — the composed message composer.
 *
 * The new API is composition-based: <PromptInput onSubmit> wraps an
 * InputGroup, and children (textarea + submit) read the shared submit /
 * attachments contexts. `status` on the submit button switches the icon
 * (arrow → spinner/stop/error). No file pickers are mounted here, so there
 * are no permission prompts.
 */

const meta: Meta = {
  title: 'Chatbot/PromptInput',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

function DefaultComposer() {
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    setLastSubmitted(message.text);
  };

  return (
    <View style={{ gap: 8 }}>
      <DemoErrorBoundary label="PromptInput failed">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea placeholder="Ask anything…" />
          <PromptInputSubmit />
        </PromptInput>
      </DemoErrorBoundary>
      <Text style={{ fontSize: 12, color: '#6b7280' }}>
        {lastSubmitted === null
          ? 'Type and press the send button (or Return) to submit.'
          : `Last submitted: "${lastSubmitted}"`}
      </Text>
    </View>
  );
}

export const Default: StoryObj = {
  name: 'Input + submit',
  render: () => <DefaultComposer />,
};

export const Streaming: StoryObj = {
  name: 'Streaming (stop button)',
  render: () => (
    <DemoErrorBoundary label="PromptInput (streaming) failed">
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea placeholder="Generating a reply…" />
        <PromptInputSubmit status="streaming" onStop={() => {}} />
      </PromptInput>
    </DemoErrorBoundary>
  ),
};
