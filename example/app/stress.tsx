import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Message, MessageContent } from '../../src/chatbot/message/Message';
import { MessageResponse } from '../../src/chatbot/message/MessageResponse';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

/* -------------------------------------------------------------------------- */
/*                                  Fixtures                                   */
/* -------------------------------------------------------------------------- */
// Hoisted to module scope so no fixture/style/array object is re-created per
// render or per streaming tick.

// (a) prose + bold / italic / inline code
const FIXTURE_PROSE = `The **Fabric** renderer replaces the legacy bridge with a *synchronous* JSI layer, so a React component can call straight into native code without serializing a JSON message. In practice a view like \`MessageResponse\` mounts its native \`EnrichedMarkdownText\` host directly, and layout is measured on the *shadow tree* with Yoga before a single frame is committed.

When you stream tokens into an already-mounted view, only the **diff** is handed to the native side — the previous glyph runs stay cached. That is why appending \`four more words\` per tick stays cheap even at message number *forty*: the cost is proportional to the *tail*, not the whole document. Keep every \`setState\` confined to the row that actually changed and the JS thread never blocks the UI thread.`;

// (b) fenced ts code block + list
const FIXTURE_CODE = `Here is a minimal streaming reducer and the steps it runs through.

\`\`\`ts
type Token = { text: string; done: boolean };

function appendToken(buffer: string, token: Token): string {
  const next = buffer + token.text;
  return token.done ? next.trimEnd() : next;
}

const stream = tokens.reduce(appendToken, '');
\`\`\`

The pipeline stays predictable if you follow a few rules:

1. **Tokenize once** — never re-split the full string on every tick.
2. **Mutate the tail** — append to a buffer instead of rebuilding it.
3. *Batch* your state writes so React commits a single frame.
4. Clear every timer in the effect cleanup to avoid leaks.

- Works with Hermes and the new architecture.
- No bridge serialization on the hot path.
- Safe to render forty rows at once.`;

// (c) GFM table + blockquote
const FIXTURE_TABLE = `Different renderers make very different trade-offs when the document grows. The table below summarizes what matters for a long chat.

| Renderer            | Virtualized | Native views | Streaming cost |
| ------------------- | :---------: | :----------: | -------------- |
| Plain \`Text\`        |     no      |     one      | rebuild whole  |
| WebView markdown    |     no      |    bridge    | reflow page    |
| Enriched (this lib) |     yes     |   per block  | tail only      |

> The cheapest update is the one you never send. Confine state to the streaming row, memoize everything else, and the frame budget stays yours.

A GitHub-flavored table needs \`flavor="github"\`; on \`commonmark\` the pipes render as literal text. Rows lay out as native cells, so wide tables scroll horizontally without reflowing the surrounding chat.`;

// (d) LaTeX-heavy (inline + display math)
const FIXTURE_MATH = `Special relativity ties energy to mass through $E = mc^2$, but the more useful quantity when things move fast is the **Lorentz factor**:

$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$

A clock moving at velocity $v$ relative to you ticks slow by exactly that factor, so $\\Delta t' = \\gamma\\,\\Delta t$. At $v = 0.6c$ the factor is $\\gamma = 1.25$; at $v = 0.9c$ it climbs to $\\gamma \\approx 2.29$; and as $v \\to c$ the factor $\\gamma \\to \\infty$, which is why no massive object ever reaches light speed.

Momentum picks up the same correction, $p = \\gamma m v$, and the full energy is $E = \\gamma m c^2$. Expanding for small $v$ recovers the Newtonian kinetic term $\\tfrac{1}{2} m v^2$ plus the rest energy $mc^2$, so the classical result is just the *low-speed* corner of the relativistic one.`;

const ASSISTANT_FIXTURES = [
  FIXTURE_PROSE,
  FIXTURE_CODE,
  FIXTURE_TABLE,
  FIXTURE_MATH,
];

const USER_PROMPTS = [
  'Can you explain how the new architecture speeds up rendering?',
  'Show me a small streaming reducer in TypeScript.',
  'Which markdown renderer should I use for a long chat?',
  'Give me a quick refresher on the Lorentz factor.',
];

// Hoisted native-renderer config objects — passed by reference, never rebuilt.
const MD4C_FLAGS = { latexMath: true };
const REMEND_CONFIG = { katex: true };

/* -------------------------------------------------------------------------- */
/*                              Streaming tuning                               */
/* -------------------------------------------------------------------------- */

const TICK_MS = 16; // per-frame cadence
const WORDS_PER_TICK = 4;
const STRESS_EXCHANGES = 10;
const SEED_EXCHANGES = 25; // 25 exchanges = 50 messages

/** Split into word-ish tokens that keep trailing whitespace so join() is lossless. */
function tokenize(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}

/* -------------------------------------------------------------------------- */
/*                                Message model                               */
/* -------------------------------------------------------------------------- */

type StressMessage = {
  id: string;
  role: 'user' | 'assistant';
  markdown: string;
  /** True only for the single row that is actively streaming. */
  streaming: boolean;
};

function buildExchange(index: number, assistantMarkdown: string): StressMessage[] {
  return [
    {
      id: `u-${index}`,
      role: 'user',
      markdown: USER_PROMPTS[index % USER_PROMPTS.length],
      streaming: false,
    },
    {
      id: `a-${index}`,
      role: 'assistant',
      markdown: assistantMarkdown,
      streaming: false,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                                    Row                                      */
/* -------------------------------------------------------------------------- */

type StressRowProps = {
  role: 'user' | 'assistant';
  markdown: string;
  streaming: boolean;
};

function StressRowBase({ role, markdown, streaming }: StressRowProps) {
  if (role === 'user') {
    return (
      <Message from="user">
        <MessageContent from="user">
          <Text style={styles.userText}>{markdown}</Text>
        </MessageContent>
      </Message>
    );
  }

  return (
    <Message from="assistant">
      <MessageContent from="assistant">
        <MessageResponse
          markdown={markdown}
          flavor="github"
          md4cFlags={MD4C_FLAGS}
          remendConfig={REMEND_CONFIG}
          // Only the actively streaming row animates its appended tail.
          streamingAnimation={streaming}
        />
      </MessageContent>
    </Message>
  );
}

// Memo comparator confined to the props that actually change while streaming, so
// only the streaming row re-renders its (expensive) native enriched-markdown view.
const StressRow = React.memo(
  StressRowBase,
  (prev, next) =>
    prev.role === next.role &&
    prev.streaming === next.streaming &&
    prev.markdown === next.markdown,
);
StressRow.displayName = 'StressRow';

const keyExtractor = (item: StressMessage) => item.id;

/* -------------------------------------------------------------------------- */
/*                                   Screen                                    */
/* -------------------------------------------------------------------------- */

type StreamInfo = { done: number; total: number };

export default function StressScreen() {
  const [messages, setMessages] = useState<StressMessage[]>([]);
  const [running, setRunning] = useState(false);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);

  const listRef = useRef<FlatList<StressMessage>>(null);

  // --- streaming engine state (refs so ticks never depend on stale closures) ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exchangesLeftRef = useRef(0); // exchanges still to append in this run
  const exchangeSeqRef = useRef(0); // total exchanges ever created (ids + fixture cycle)
  const tokensRef = useRef<string[]>([]); // tokens of the current assistant fixture
  const tokenPosRef = useRef(0); // tokens emitted so far
  const targetRef = useRef(''); // full assistant fixture being streamed
  const streamingIdRef = useRef<string | null>(null); // id of the row being streamed

  // --- stick-to-bottom (FlatList has no built-in; Conversation's is ScrollView-only) ---
  const atBottomRef = useRef(true);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      atBottomRef.current =
        contentOffset.y >= contentSize.height - layoutMeasurement.height - 40;
    },
    [],
  );

  const handleContentSizeChange = useCallback(() => {
    if (atBottomRef.current) {
      listRef.current?.scrollToEnd({ animated: false });
    }
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishRun = useCallback(() => {
    stopInterval();
    streamingIdRef.current = null;
    setRunning(false);
    setStreamInfo(null);
  }, [stopInterval]);

  // Single self-driving interval acting as a small state machine:
  //  - no streaming row  -> start the next exchange (or finish the run)
  //  - streaming row      -> append ~4 words to that row, finalize when complete
  const tick = useCallback(() => {
    if (streamingIdRef.current === null) {
      if (exchangesLeftRef.current <= 0) {
        finishRun();
        return;
      }
      exchangesLeftRef.current -= 1;

      const index = exchangeSeqRef.current;
      exchangeSeqRef.current += 1;

      const fixture = ASSISTANT_FIXTURES[index % ASSISTANT_FIXTURES.length];
      const tokens = tokenize(fixture);
      const first = Math.min(WORDS_PER_TICK, tokens.length);
      const partial = tokens.slice(0, first).join('');
      const assistantId = `a-${index}`;

      tokensRef.current = tokens;
      tokenPosRef.current = first;
      targetRef.current = fixture;
      streamingIdRef.current = assistantId;

      setMessages((prev) => [
        ...prev,
        {
          id: `u-${index}`,
          role: 'user',
          markdown: USER_PROMPTS[index % USER_PROMPTS.length],
          streaming: false,
        },
        { id: assistantId, role: 'assistant', markdown: partial, streaming: true },
      ]);
      setStreamInfo({ done: partial.length, total: fixture.length });

      if (first >= tokens.length) {
        // Fixture already exhausted in one chunk — finalize it.
        streamingIdRef.current = null;
        setMessages((prev) => finalizeLast(prev, assistantId, fixture));
      }
      return;
    }

    // Continue streaming the current assistant row.
    const tokens = tokensRef.current;
    const nextPos = Math.min(tokenPosRef.current + WORDS_PER_TICK, tokens.length);
    tokenPosRef.current = nextPos;

    const partial = tokens.slice(0, nextPos).join('');
    const assistantId = streamingIdRef.current;

    setMessages((prev) => {
      const last = prev.length - 1;
      if (last < 0 || prev[last].id !== assistantId) {
        return prev;
      }
      const next = prev.slice();
      next[last] = { ...next[last], markdown: partial };
      return next;
    });
    setStreamInfo({ done: partial.length, total: targetRef.current.length });

    if (nextPos >= tokens.length) {
      streamingIdRef.current = null;
      setMessages((prev) => finalizeLast(prev, assistantId, targetRef.current));
    }
  }, [finishRun]);

  // Keep the interval pointing at the latest tick without recreating the timer.
  const tickRef = useRef(tick);
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // Cleanup on unmount (mirrors the /markdown route's interval teardown).
  useEffect(() => stopInterval, [stopInterval]);

  const seed = useCallback(() => {
    stopInterval();
    streamingIdRef.current = null;
    exchangesLeftRef.current = 0;
    exchangeSeqRef.current = SEED_EXCHANGES;

    const seeded: StressMessage[] = [];
    for (let i = 0; i < SEED_EXCHANGES; i += 1) {
      seeded.push(
        ...buildExchange(i, ASSISTANT_FIXTURES[i % ASSISTANT_FIXTURES.length]),
      );
    }
    setMessages(seeded);
    setRunning(false);
    setStreamInfo(null);
  }, [stopInterval]);

  const runStress = useCallback(() => {
    if (intervalRef.current) {
      return; // a run is already in flight
    }
    exchangesLeftRef.current = STRESS_EXCHANGES;
    streamingIdRef.current = null; // force the first tick to open a fresh exchange
    setRunning(true);
    intervalRef.current = setInterval(() => tickRef.current(), TICK_MS);
  }, []);

  const reset = useCallback(() => {
    stopInterval();
    streamingIdRef.current = null;
    exchangesLeftRef.current = 0;
    exchangeSeqRef.current = 0;
    setMessages([]);
    setRunning(false);
    setStreamInfo(null);
  }, [stopInterval]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<StressMessage>) => (
      <StressRow
        role={item.role}
        markdown={item.markdown}
        streaming={item.streaming}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Long-chat stress</Text>
        <Text style={styles.subtitle}>
          Real render path: {'<MessageResponse />'} enriched-markdown rows in a
          memoized FlatList
        </Text>

        <View style={styles.controls}>
          <HeaderButton label="Seed 50" onPress={seed} disabled={running} />
          <HeaderButton
            label="Run stress ×10"
            onPress={runStress}
            disabled={running}
          />
          <HeaderButton label="Reset" onPress={reset} tone="ghost" />
        </View>

        <Text style={styles.counter}>
          {messages.length} messages{'   ·   '}
          {streamInfo
            ? `streaming ${streamInfo.done}/${streamInfo.total} chars`
            : running
              ? 'running…'
              : 'idle'}
        </Text>
      </View>

      <DemoErrorBoundary label="Stress list failed">
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          // Keep every prior row mounted so "Seed 50" genuinely measures the
          // mount cost of ~25 native enriched-markdown views at once.
          initialNumToRender={SEED_EXCHANGES * 2}
          maxToRenderPerBatch={12}
          windowSize={100}
          removeClippedSubviews={false}
        />
      </DemoErrorBoundary>
    </SafeAreaView>
  );
}

/** Replace the last row (if it is the streaming one) with its finalized content. */
function finalizeLast(
  prev: StressMessage[],
  assistantId: string,
  markdown: string,
): StressMessage[] {
  const last = prev.length - 1;
  if (last < 0 || prev[last].id !== assistantId) {
    return prev;
  }
  const next = prev.slice();
  next[last] = { ...next[last], markdown, streaming: false };
  return next;
}

/* -------------------------------------------------------------------------- */
/*                                  Button                                     */
/* -------------------------------------------------------------------------- */

type HeaderButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'solid' | 'ghost';
};

function HeaderButton({
  label,
  onPress,
  disabled = false,
  tone = 'solid',
}: HeaderButtonProps) {
  const ghost = tone === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        ghost ? styles.btnGhost : styles.btnSolid,
        disabled && styles.btnDisabled,
      ]}
    >
      <Text style={[styles.btnText, ghost && styles.btnGhostText]}>{label}</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#111' },
  subtitle: { fontSize: 12, color: '#6b7280' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  counter: { fontSize: 12, color: '#2563eb', fontWeight: '700' },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 16 },
  userText: { color: '#111', fontSize: 14, lineHeight: 20 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  btnSolid: { backgroundColor: '#111' },
  btnGhost: { backgroundColor: '#f3f4f6' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnGhostText: { color: '#111' },
});
