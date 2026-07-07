import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/primitives/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../src/primitives/DropdownMenu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../src/primitives/Drawer';
import { DemoErrorBoundary } from '../components/DemoErrorBoundary';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
  { value: 'qwik', label: 'Qwik' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: '800' }}>{title}</Text>
      {children}
    </View>
  );
}

export default function SheetsScreen() {
  const [framework, setFramework] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('none');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: '900' }}>Sheets</Text>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Bottom-sheet primitives: Select, DropdownMenu, Drawer
          </Text>
        </View>

        <Section title="Select (6 options)">
          <DemoErrorBoundary label="Select failed">
            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS.map((item) => (
                  <SelectItem key={item.value} value={item.value} label={item.label} />
                ))}
              </SelectContent>
            </Select>
          </DemoErrorBoundary>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Selected: {framework || '(none)'}
          </Text>
        </Section>

        <Section title="DropdownMenu">
          <DemoErrorBoundary label="DropdownMenu failed">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Open menu</Text>
                </View>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem label="Edit" onPress={() => setLastAction('edit')} />
                <DropdownMenuItem
                  label="Duplicate"
                  onPress={() => setLastAction('duplicate')}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  label="Delete"
                  variant="destructive"
                  onPress={() => setLastAction('delete')}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </DemoErrorBoundary>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>Last action: {lastAction}</Text>
        </Section>

        <Section title="Drawer">
          <DemoErrorBoundary label="Drawer failed">
            <Drawer>
              <DrawerTrigger>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#111',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Open drawer</Text>
                </View>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer title</DrawerTitle>
                  <DrawerDescription>
                    A bottom-sheet drawer opened by a button.
                  </DrawerDescription>
                </DrawerHeader>
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Text style={{ color: '#374151' }}>
                    Drawer body content. Swipe down or tap Close to dismiss.
                  </Text>
                </View>
                <DrawerFooter>
                  <DrawerClose>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingVertical: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontWeight: '600' }}>Close</Text>
                    </View>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DemoErrorBoundary>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
