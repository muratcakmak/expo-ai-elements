import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { Button } from '../../../src/primitives/Button';
import { Badge } from '../../../src/primitives/Badge';
import { Separator } from '../../../src/primitives/Separator';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../src/primitives/Card';
import { Progress } from '../../../src/primitives/Progress';
import { Spinner } from '../../../src/primitives/Spinner';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../../src/primitives/Collapsible';

const meta: Meta = {
  title: 'Primitives',
  decorators: [(Story) => <View style={{ padding: 16, gap: 16 }}><Story /></View>],
};
export default meta;

export const Buttons: StoryObj = {
  name: 'Button — All Variants',
  render: () => (
    <View style={{ gap: 8 }}>
      <Button variant="default" onPress={() => {}}><Text style={{ color: '#fff' }}>Default</Text></Button>
      <Button variant="secondary" onPress={() => {}}><Text>Secondary</Text></Button>
      <Button variant="outline" onPress={() => {}}><Text>Outline</Text></Button>
      <Button variant="ghost" onPress={() => {}}><Text>Ghost</Text></Button>
      <Button variant="destructive" onPress={() => {}}><Text style={{ color: '#fff' }}>Destructive</Text></Button>
      <Button variant="default" disabled onPress={() => {}}><Text style={{ color: '#fff' }}>Disabled</Text></Button>
    </View>
  ),
};

export const Badges: StoryObj = {
  name: 'Badge — All Variants',
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <Badge variant="default"><Text style={{ color: '#fff', fontSize: 12 }}>Default</Text></Badge>
      <Badge variant="secondary"><Text style={{ fontSize: 12 }}>Secondary</Text></Badge>
      <Badge variant="outline"><Text style={{ fontSize: 12 }}>Outline</Text></Badge>
      <Badge variant="destructive"><Text style={{ color: '#fff', fontSize: 12 }}>Destructive</Text></Badge>
    </View>
  ),
};

export const SeparatorStory: StoryObj = {
  name: 'Separator',
  render: () => (
    <View style={{ gap: 12 }}>
      <Text>Above</Text>
      <Separator />
      <Text>Below</Text>
    </View>
  ),
};

export const CardStory: StoryObj = {
  name: 'Card',
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle><Text style={{ fontWeight: '700' }}>Card Title</Text></CardTitle>
      </CardHeader>
      <CardContent>
        <Text style={{ color: '#6b7280' }}>This is the card content area.</Text>
      </CardContent>
      <CardFooter>
        <Text style={{ fontSize: 12, color: '#9ca3af' }}>Footer</Text>
      </CardFooter>
    </Card>
  ),
};

export const ProgressStory: StoryObj = {
  name: 'Progress',
  render: () => (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 13 }}>25%</Text>
      <Progress value={25} />
      <Text style={{ fontSize: 13 }}>75%</Text>
      <Progress value={75} />
      <Text style={{ fontSize: 13 }}>100%</Text>
      <Progress value={100} />
    </View>
  ),
};

export const SpinnerStory: StoryObj = {
  name: 'Spinner',
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Spinner size="small" />
      <Spinner size="large" />
    </View>
  ),
};

export const CollapsibleStory: StoryObj = {
  name: 'Collapsible',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <Text style={{ color: '#2563eb', fontWeight: '600' }}>
            {open ? '▼ Collapse' : '▶ Expand'}
          </Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <View style={{ paddingTop: 8 }}>
            <Text>This is the collapsible content! It appears and disappears.</Text>
          </View>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};
