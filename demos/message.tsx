import { Message, MessageContent, MessageText } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function MessageDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="User message">
        <Message role="user">
          <MessageContent>
            <MessageText>Can you explain how React hooks work?</MessageText>
          </MessageContent>
        </Message>
      </PreviewSection>

      <PreviewSection title="Assistant message">
        <Message role="assistant">
          <MessageContent>
            <MessageText>
              React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState and useEffect.
            </MessageText>
          </MessageContent>
        </Message>
      </PreviewSection>

      <PreviewSection title="System message">
        <Message role="system">
          <MessageContent>
            <MessageText>You are a helpful coding assistant.</MessageText>
          </MessageContent>
        </Message>
      </PreviewSection>
    </View>
  );
}
