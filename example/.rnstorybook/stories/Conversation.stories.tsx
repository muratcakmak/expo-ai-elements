import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import type { UIMessage } from 'ai';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '../../../src/chatbot/conversation/Conversation';
import { Message, MessageContent } from '../../../src/chatbot/message/Message';

/**
 * Conversation — a stick-to-bottom ScrollView.
 *
 * The new API is composition-based (children + ConversationContent), not the
 * old `data`/`renderItem` FlatList. It fills its parent via `flex-1`, so it
 * needs a bounded-height container to scroll.
 */

type ChatMessage = { role: UIMessage['role']; text: string };

const MESSAGES: ChatMessage[] = [
  { role: 'user', text: 'What is the capital of France?' },
  { role: 'assistant', text: 'The capital of France is Paris.' },
  { role: 'user', text: 'What about Germany?' },
  {
    role: 'assistant',
    text: 'The capital of Germany is Berlin. It has been the capital since reunification in 1990.',
  },
  { role: 'user', text: 'And Japan?' },
  { role: 'assistant', text: 'The capital of Japan is Tokyo.' },
];

const meta: Meta = {
  title: 'Chatbot/Conversation',
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fff' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

export const MiniConversation: StoryObj = {
  name: 'Mini conversation (scrollable)',
  render: () => (
    <View
      style={{
        height: 360,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <Conversation>
        <ConversationContent>
          {MESSAGES.map((m, i) => (
            <Message key={`${m.role}-${i}`} from={m.role}>
              <MessageContent from={m.role}>
                <Text style={{ fontSize: 14, lineHeight: 20, color: '#111' }}>
                  {m.text}
                </Text>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
    </View>
  ),
};

export const EmptyState: StoryObj = {
  name: 'Empty state',
  render: () => (
    <View
      style={{
        height: 280,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <Conversation>
        <ConversationEmptyState
          title="No messages yet"
          description="Start a conversation to see messages here"
        />
      </Conversation>
    </View>
  ),
};
