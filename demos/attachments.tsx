import { Attachments } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function AttachmentsDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="File attachments" description="Image, PDF, and text files">
        <Attachments
          attachments={[
            {
              id: '1',
              name: 'screenshot.png',
              size: 245760,
              type: 'image/png',
            },
            {
              id: '2',
              name: 'report.pdf',
              size: 1048576,
              type: 'application/pdf',
            },
            {
              id: '3',
              name: 'notes.txt',
              size: 2048,
              type: 'text/plain',
            },
          ]}
        />
      </PreviewSection>
    </View>
  );
}
