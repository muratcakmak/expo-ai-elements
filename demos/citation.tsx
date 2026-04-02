import { InlineCitation, Sources } from '@/components/ai';
import type { Source } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

const sources: Source[] = [
  {
    title: 'Attention Is All You Need',
    url: 'https://arxiv.org/abs/1706.03762',
    snippet: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.',
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    url: 'https://arxiv.org/abs/1810.04805',
    snippet: 'We introduce BERT, designed to pre-train deep bidirectional representations from unlabeled text.',
  },
  {
    title: 'Language Models are Few-Shot Learners',
    url: 'https://arxiv.org/abs/2005.14165',
    snippet: 'We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance.',
  },
];

export function CitationDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Inline citations" description="Clickable reference markers">
        <View className="flex-row flex-wrap items-center gap-1">
          <Text className="text-foreground text-sm">
            Transformers revolutionized NLP
          </Text>
          <InlineCitation index={1} source={sources[0]} />
          <Text className="text-foreground text-sm">
            and BERT showed the power of pre-training
          </Text>
          <InlineCitation index={2} source={sources[1]} />
        </View>
      </PreviewSection>

      <PreviewSection title="Sources list" description="Full source references">
        <Sources sources={sources} />
      </PreviewSection>
    </View>
  );
}
