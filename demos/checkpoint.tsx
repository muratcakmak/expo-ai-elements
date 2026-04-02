import { Checkpoint, CheckpointIcon, CheckpointTrigger } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, View } from 'react-native';

type MessageData = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const initialMessages: MessageData[] = [
  { id: 'm1', role: 'user', content: 'What is React?' },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.',
  },
  { id: 'm3', role: 'user', content: 'How does component state work?' },
  {
    id: 'm4',
    role: 'assistant',
    content:
      'Component state is managed using hooks like useState. When state changes, React re-renders the component to reflect the new values.',
  },
  { id: 'm5', role: 'user', content: 'What about context?' },
];

const checkpoints = [
  { afterMessageIndex: 1, label: 'Restore checkpoint' },
  { afterMessageIndex: 3, label: 'Restore checkpoint' },
];

export function CheckpointDemo() {
  const [messages, setMessages] = React.useState(initialMessages);

  const handleRestore = React.useCallback(
    (afterIndex: number) => {
      const count = afterIndex + 1;
      setMessages(initialMessages.slice(0, count));
      Alert.alert('Checkpoint restored', `Conversation restored to ${count} messages`);
    },
    []
  );

  return (
    <View className="gap-6">
      <PreviewSection
        title="Conversation with checkpoints"
        description="Tap a checkpoint to restore the conversation to that point"
      >
        <View className="gap-2">
          {messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              <View
                className={
                  msg.role === 'user'
                    ? 'bg-primary self-end rounded-2xl rounded-br-sm px-4 py-2'
                    : 'bg-muted self-start rounded-2xl rounded-bl-sm px-4 py-2'
                }
              >
                <Text
                  className={
                    msg.role === 'user'
                      ? 'text-primary-foreground text-sm'
                      : 'text-foreground text-sm'
                  }
                >
                  {msg.content}
                </Text>
              </View>

              {checkpoints
                .filter((cp) => cp.afterMessageIndex === index)
                .map((cp) => (
                  <Checkpoint key={`cp-${cp.afterMessageIndex}`}>
                    <CheckpointIcon />
                    <CheckpointTrigger onPress={() => handleRestore(cp.afterMessageIndex)}>
                      {cp.label}
                    </CheckpointTrigger>
                  </Checkpoint>
                ))}
            </React.Fragment>
          ))}
        </View>
      </PreviewSection>

      <PreviewSection title="Standalone checkpoints" description="Different checkpoint styles">
        <View className="gap-3">
          <Checkpoint>
            <CheckpointIcon />
            <CheckpointTrigger onPress={() => Alert.alert('Checkpoint', 'Context updated')}>
              Context updated
            </CheckpointTrigger>
          </Checkpoint>

          <Checkpoint>
            <CheckpointIcon />
            <CheckpointTrigger onPress={() => Alert.alert('Checkpoint', 'New session')}>
              New session started
            </CheckpointTrigger>
          </Checkpoint>
        </View>
      </PreviewSection>
    </View>
  );
}
