import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStreamingChat } from '../../src/hooks/useStreamingChat';
import { Message, MessageContent } from '../../src/chatbot/message/Message';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

function ChatScreenInner() {
  const { messages, sendMessage, status, error } = useStreamingChat({
    api: '/api/mock-chat',
  });
  const [input, setInput] = useState('');

  const isBusy = status === 'submitted' || status === 'streaming';

  const handleSend = () => {
    const text = input.trim();
    if (!text || isBusy) {
      return;
    }
    sendMessage({ text });
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          endpoint: /api/mock-chat (keyless)
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563eb' }}>
          {status}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {messages.length === 0 ? (
          <Text style={{ color: '#9ca3af' }}>
            Send a message to stream a canned reply from the mock endpoint.
          </Text>
        ) : null}

        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent from={message.role}>
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <Text
                    key={`${message.id}-${index}`}
                    style={{ fontSize: 14, lineHeight: 20, color: '#111' }}
                  >
                    {part.text}
                  </Text>
                ) : null,
              )}
            </MessageContent>
          </Message>
        ))}

        {error ? (
          <Text style={{ color: '#dc2626', fontSize: 13 }}>Error: {error.message}</Text>
        ) : null}
      </ScrollView>

      <SafeAreaView edges={['bottom']}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 15,
            }}
          />
          <Pressable
            onPress={handleSend}
            disabled={isBusy || input.trim().length === 0}
            style={{
              backgroundColor: isBusy || input.trim().length === 0 ? '#9ca3af' : '#111',
              borderRadius: 20,
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default function ChatScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DemoErrorBoundary label="Chat (useStreamingChat) failed">
        <ChatScreenInner />
      </DemoErrorBoundary>
    </View>
  );
}
