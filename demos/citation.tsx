import {
  InlineCitation,
  InlineCitationCard,
  Sources,
  SourcesContent,
  Source,
} from '@/components/ai';
import type { SourceData } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, View } from 'react-native';

const nlpSources: SourceData[] = [
  {
    title: 'Advances in Natural Language Processing',
    url: 'https://example.com/nlp-advances',
    description:
      'A comprehensive study on the recent developments in natural language processing technologies and their applications.',
  },
  {
    title: 'Breakthroughs in Machine Learning',
    url: 'https://mlnews.org/breakthroughs',
    description:
      'An overview of the most significant machine learning breakthroughs in the past year.',
  },
  {
    title: 'AI in Healthcare: Current Trends',
    url: 'https://healthai.com/trends',
    description:
      'A report on how artificial intelligence is transforming healthcare and diagnostics.',
  },
];

const ethicsSources: SourceData[] = [
  {
    title: 'Ethics of Artificial Intelligence',
    url: 'https://aiethics.org/overview',
    description:
      'A discussion on the ethical considerations and challenges in the development of AI.',
  },
  {
    title: 'Scaling Deep Learning Models',
    url: 'https://deeplearninghub.com/scaling-models',
    description:
      'Insights into the technical challenges and solutions for scaling deep learning architectures.',
  },
];

const allSources: SourceData[] = [
  { title: 'Stripe API Documentation', url: 'https://stripe.com/docs/api' },
  { title: 'GitHub REST API', url: 'https://docs.github.com/en/rest' },
  { title: 'AWS SDK for JavaScript', url: 'https://docs.aws.amazon.com/sdk-for-javascript/' },
];

export function CitationDemo() {
  const [cardVisible, setCardVisible] = React.useState<string | null>(null);

  const toggleCard = React.useCallback((key: string) => {
    setCardVisible((prev) => (prev === key ? null : key));
  }, []);

  return (
    <View className="gap-6">
      <PreviewSection title="Inline citations" description="Tappable badges that reveal source details">
        <View className="gap-3">
          <View className="flex-row flex-wrap items-center">
            <Text className="text-sm leading-relaxed">
              According to recent studies, artificial intelligence has shown remarkable progress in
              natural language processing.{' '}
            </Text>
            <InlineCitation
              sources={nlpSources}
              onPress={() => toggleCard('nlp')}
            />
          </View>

          {cardVisible === 'nlp' ? (
            <InlineCitationCard sources={nlpSources} />
          ) : null}

          <View className="flex-row flex-wrap items-center">
            <Text className="text-sm leading-relaxed">
              The ethical implications of AI development continue to be debated across the industry.{' '}
            </Text>
            <InlineCitation
              sources={ethicsSources}
              onPress={() => toggleCard('ethics')}
            />
          </View>

          {cardVisible === 'ethics' ? (
            <InlineCitationCard sources={ethicsSources} />
          ) : null}
        </View>
      </PreviewSection>

      <PreviewSection title="Sources panel" description="Collapsible list of referenced sources">
        <Sources count={allSources.length} defaultOpen>
          <SourcesContent>
            {allSources.map((source) => (
              <Source
                key={source.url}
                title={source.title}
                url={source.url}
                onPress={() => Alert.alert('Source tapped', source.title)}
              />
            ))}
          </SourcesContent>
        </Sources>
      </PreviewSection>
    </View>
  );
}
