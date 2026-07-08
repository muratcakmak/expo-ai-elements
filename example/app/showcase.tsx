import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ===== PRIMITIVES =====
import { Button } from '../../src/primitives/Button';
import { Badge } from '../../src/primitives/Badge';
import { Separator } from '../../src/primitives/Separator';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../src/primitives/Card';
import { Progress } from '../../src/primitives/Progress';
import { Spinner } from '../../src/primitives/Spinner';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../src/primitives/Collapsible';

// ===== CHAT =====
import { Message, MessageContent } from '../../src/chatbot/message/Message';
import { MessageToolbar } from '../../src/chatbot/message/MessageToolbar';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 12, color: '#111' }}>{title}</Text>
      {children}
    </View>
  );
}

export default function ShowcaseScreen() {
  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', marginBottom: 4 }}>expo-ai-elements</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>Component Showcase</Text>

        {/* ===== BUTTONS ===== */}
        <Section title="Button">
          <View style={{ gap: 8 }}>
            <Button variant="default" onPress={() => {}}><Text style={{ color: '#fff' }}>Default</Text></Button>
            <Button variant="secondary" onPress={() => {}}><Text>Secondary</Text></Button>
            <Button variant="outline" onPress={() => {}}><Text>Outline</Text></Button>
            <Button variant="ghost" onPress={() => {}}><Text>Ghost</Text></Button>
            <Button variant="destructive" onPress={() => {}}><Text style={{ color: '#fff' }}>Destructive</Text></Button>
            <Button variant="default" size="sm" onPress={() => {}}><Text style={{ color: '#fff', fontSize: 12 }}>Small</Text></Button>
            <Button variant="default" size="lg" onPress={() => {}}><Text style={{ color: '#fff', fontSize: 16 }}>Large</Text></Button>
          </View>
        </Section>

        <Separator />

        {/* ===== BADGES ===== */}
        <Section title="Badge">
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant="default"><Text style={{ color: '#fff', fontSize: 12 }}>Default</Text></Badge>
            <Badge variant="secondary"><Text style={{ fontSize: 12 }}>Secondary</Text></Badge>
            <Badge variant="outline"><Text style={{ fontSize: 12 }}>Outline</Text></Badge>
            <Badge variant="destructive"><Text style={{ color: '#fff', fontSize: 12 }}>Error</Text></Badge>
          </View>
        </Section>

        <Separator />

        {/* ===== CARD ===== */}
        <Section title="Card">
          <Card>
            <CardHeader>
              <CardTitle><Text style={{ fontWeight: '700', fontSize: 16 }}>Card Title</Text></CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ color: '#6b7280' }}>This is card content. Cards are used throughout the library for structured information display.</Text>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onPress={() => {}}>
                <Text style={{ fontSize: 12 }}>Action</Text>
              </Button>
            </CardFooter>
          </Card>
        </Section>

        <Separator />

        {/* ===== PROGRESS ===== */}
        <Section title="Progress">
          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>25%</Text>
              <Progress value={25} />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>75%</Text>
              <Progress value={75} />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>100%</Text>
              <Progress value={100} />
            </View>
          </View>
        </Section>

        <Separator />

        {/* ===== SPINNER ===== */}
        <Section title="Spinner">
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Spinner size="small" />
            <Text style={{ color: '#6b7280' }}>Loading...</Text>
            <Spinner size="large" />
          </View>
        </Section>

        <Separator />

        {/* ===== COLLAPSIBLE ===== */}
        <Section title="Collapsible">
          <Collapsible open={collapseOpen} onOpenChange={setCollapseOpen}>
            <CollapsibleTrigger>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text style={{ fontSize: 16 }}>{collapseOpen ? '▼' : '▶'}</Text>
                <Text style={{ fontWeight: '600' }}>Tap to {collapseOpen ? 'collapse' : 'expand'}</Text>
              </View>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={{ padding: 12, marginTop: 8, backgroundColor: '#f9fafb', borderRadius: 8 }}>
                <Text style={{ lineHeight: 20 }}>
                  This content is inside a Collapsible component. It&apos;s used by 6+ other components in the library: Reasoning, Tool, Task, ChainOfThought, FileTree, and Sources.
                </Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </Section>

        <Separator />

        {/* ===== MESSAGES ===== */}
        <Section title="Chat Messages">
          <View style={{ gap: 16 }}>
            <Message from="user">
              <MessageContent from="user">
                <Text style={{ color: '#fff', fontSize: 14 }}>Hello! Can you help me with React Native?</Text>
              </MessageContent>
            </Message>

            <Message from="assistant">
              <MessageContent from="assistant">
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                  Of course! React Native lets you build mobile apps using React. It renders to native platform views using JSI and the new Fabric architecture.
                </Text>
              </MessageContent>
              <MessageToolbar>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="ghost" size="sm" onPress={() => {}}>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Copy</Text>
                  </Button>
                  <Button variant="ghost" size="sm" onPress={() => {}}>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Retry</Text>
                  </Button>
                </View>
              </MessageToolbar>
            </Message>

            <Message from="user">
              <MessageContent from="user">
                <Text style={{ color: '#fff', fontSize: 14 }}>That&apos;s great! What about styling?</Text>
              </MessageContent>
            </Message>

            <Message from="assistant">
              <MessageContent from="assistant">
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                  This library uses Uniwind (Tailwind CSS v4 for React Native). Components accept a className prop that gets compiled to native styles at build time. No runtime overhead!
                </Text>
              </MessageContent>
            </Message>
          </View>
        </Section>

        <Separator />

        {/* ===== STATUS ===== */}
        <Card>
          <CardHeader>
            <CardTitle><Text style={{ fontWeight: '700' }}>Render Status</Text></CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Button (6 variants + 3 sizes)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Badge (4 variants)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Separator</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Card (Header, Title, Content, Footer)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Progress (animated bar)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Spinner</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Collapsible (expand/collapse)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ Message (user + assistant)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ MessageContent (role-based styling)</Text>
              <Text style={{ fontSize: 13, color: '#059669' }}>✓ MessageToolbar</Text>
            </View>
          </CardContent>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
