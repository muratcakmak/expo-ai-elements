import { Conversation, Message, MessageContent, MessageText } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

const messages: ChatMessage[] = [
  { role: 'user', text: 'What is the capital of France?' },
  { role: 'assistant', text: 'The capital of France is Paris.' },
  { role: 'user', text: 'What about Germany?' },
  { role: 'assistant', text: 'The capital of Germany is Berlin. It has been the capital since reunification in 1990.' },
];

export function ConversationDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Mini conversation" description="A short exchange in a fixed-height container" className="h-80 p-0">
        <Conversation<ChatMessage>
          data={messages}
          renderItem={({ item }) => (
            <Message role={item.role}>
              <MessageContent>
                <MessageText>{item.text}</MessageText>
              </MessageContent>
            </Message>
          )}
        />
      </PreviewSection>
    </View>
  );
}
