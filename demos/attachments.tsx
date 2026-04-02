import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  AttachmentEmpty,
} from '@/components/ai';
import type { AttachmentData } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import * as React from 'react';
import { View } from 'react-native';

const gridAttachments: AttachmentData[] = [
  {
    id: 'g1',
    type: 'file',
    filename: 'mountain-landscape.jpg',
    mediaType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  },
  {
    id: 'g2',
    type: 'file',
    filename: 'ocean-sunset.jpg',
    mediaType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop',
  },
  {
    id: 'g3',
    type: 'file',
    filename: 'document.pdf',
    mediaType: 'application/pdf',
    url: '',
  },
  {
    id: 'g4',
    type: 'file',
    filename: 'video.mp4',
    mediaType: 'video/mp4',
    url: '',
  },
];

const inlineAttachments: AttachmentData[] = [
  {
    id: 'i1',
    type: 'file',
    filename: 'mountain-landscape.jpg',
    mediaType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  },
  {
    id: 'i2',
    type: 'file',
    filename: 'quarterly-report.pdf',
    mediaType: 'application/pdf',
    url: '',
  },
  {
    id: 'i3',
    type: 'source-document',
    title: 'React Documentation',
    mediaType: 'text/html',
    url: 'https://react.dev',
  },
  {
    id: 'i4',
    type: 'file',
    filename: 'podcast-episode.mp3',
    mediaType: 'audio/mp3',
    url: '',
  },
];

const listAttachments: AttachmentData[] = [
  {
    id: 'l1',
    type: 'file',
    filename: 'mountain-landscape.jpg',
    mediaType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  },
  {
    id: 'l2',
    type: 'file',
    filename: 'quarterly-report-2024.pdf',
    mediaType: 'application/pdf',
    url: '',
  },
  {
    id: 'l3',
    type: 'file',
    filename: 'product-demo.mp4',
    mediaType: 'video/mp4',
    url: '',
  },
  {
    id: 'l4',
    type: 'source-document',
    title: 'API Documentation',
    filename: 'api-reference',
    mediaType: 'text/html',
    url: 'https://docs.example.com/api',
  },
  {
    id: 'l5',
    type: 'file',
    filename: 'meeting-recording.mp3',
    mediaType: 'audio/mpeg',
    url: '',
  },
];

function GridSection() {
  const [items, setItems] = React.useState(gridAttachments);

  const handleRemove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <Attachments variant="grid">
      {items.length === 0 ? (
        <AttachmentEmpty />
      ) : (
        items.map((item) => (
          <Attachment key={item.id} data={item} onRemove={() => handleRemove(item.id)}>
            <AttachmentPreview />
            <AttachmentRemove />
          </Attachment>
        ))
      )}
    </Attachments>
  );
}

function InlineSection() {
  const [items, setItems] = React.useState(inlineAttachments);

  const handleRemove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <Attachments variant="inline">
      {items.length === 0 ? (
        <AttachmentEmpty />
      ) : (
        items.map((item) => (
          <Attachment key={item.id} data={item} onRemove={() => handleRemove(item.id)}>
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))
      )}
    </Attachments>
  );
}

function ListSection() {
  const [items, setItems] = React.useState(listAttachments);

  const handleRemove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <Attachments variant="list" className="w-full">
      {items.length === 0 ? (
        <AttachmentEmpty />
      ) : (
        items.map((item) => (
          <Attachment key={item.id} data={item} onRemove={() => handleRemove(item.id)}>
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
            <AttachmentRemove />
          </Attachment>
        ))
      )}
    </Attachments>
  );
}

export function AttachmentsDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Grid variant" description="Thumbnail grid with overlay remove buttons">
        <GridSection />
      </PreviewSection>

      <PreviewSection title="Inline variant" description="Compact inline chips with icon and name">
        <InlineSection />
      </PreviewSection>

      <PreviewSection title="List variant" description="Full-width list with media type details">
        <ListSection />
      </PreviewSection>
    </View>
  );
}
