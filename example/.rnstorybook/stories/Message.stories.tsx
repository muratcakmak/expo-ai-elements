import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';

import { Message, MessageContent } from '../../../src/chatbot/message/Message';

/**
 * Message + MessageContent — role-aware chat bubbles.
 *
 * The new API drives layout/styling off the `from` prop (a UIMessage role):
 *   - Message: aligns right for `user`, left for everything else.
 *   - MessageContent: renders a grey rounded bubble for `from="user"`.
 * There is no MessageText in the new API — plain RN <Text> is used for content.
 */

const meta: Meta = {
  title: 'Chatbot/Message',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const UserMessage: StoryObj = {
  name: 'User message',
  render: () => (
    <Message from="user">
      <MessageContent from="user">
        <Text style={{ fontSize: 14, color: '#111' }}>
          Can you explain how React hooks work?
        </Text>
      </MessageContent>
    </Message>
  ),
};

export const AssistantMessage: StoryObj = {
  name: 'Assistant message',
  render: () => (
    <Message from="assistant">
      <MessageContent from="assistant">
        <Text style={{ fontSize: 14, lineHeight: 20, color: '#111' }}>
          React hooks are functions that let you use state and other React
          features in functional components. The most common hooks are useState
          and useEffect.
        </Text>
      </MessageContent>
    </Message>
  ),
};

export const Exchange: StoryObj = {
  name: 'User + assistant exchange',
  render: () => (
    <View style={{ gap: 16 }}>
      <Message from="user">
        <MessageContent from="user">
          <Text style={{ fontSize: 14, color: '#111' }}>
            What is the capital of France?
          </Text>
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageContent from="assistant">
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#111' }}>
            The capital of France is Paris.
          </Text>
        </MessageContent>
      </Message>

      <Message from="user">
        <MessageContent from="user">
          <Text style={{ fontSize: 14, color: '#111' }}>What about Germany?</Text>
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageContent from="assistant">
          <Text style={{ fontSize: 14, lineHeight: 20, color: '#111' }}>
            The capital of Germany is Berlin. It has been the capital since
            reunification in 1990.
          </Text>
        </MessageContent>
      </Message>
    </View>
  ),
};
