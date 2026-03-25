import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewProps, type ViewStyle, type PressableProps } from 'react-native';
import { ChevronDown, BookOpen } from 'lucide-react-native';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleContentProps,
} from '../../primitives/Collapsible';

/* --------------------------------- Sources --------------------------------- */

export type SourcesProps = ViewProps & {
  className?: string;
  style?: ViewStyle;
};

export const Sources = ({ className, style, ...props }: SourcesProps) => (
  <Collapsible style={[sourcesStyles.root, style]} {...props} />
);

const sourcesStyles = StyleSheet.create({
  root: {
    marginBottom: 16,
  },
});

/* ------------------------------ SourcesTrigger ----------------------------- */

export type SourcesTriggerProps = PressableProps & {
  className?: string;
  style?: ViewStyle;
  count: number;
  children?: React.ReactNode;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  style,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    style={[sourcesTriggerStyles.trigger, style]}
    {...props}
  >
    {children ?? (
      <>
        <Text style={sourcesTriggerStyles.text}>
          Used {count} sources
        </Text>
        <ChevronDown size={16} color="#6b7280" />
      </>
    )}
  </CollapsibleTrigger>
);

const sourcesTriggerStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});

/* ----------------------------- SourcesContent ------------------------------ */

export type SourcesContentProps = CollapsibleContentProps;

export const SourcesContent = ({
  className,
  style,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent style={[sourcesContentStyles.content, style]} {...props} />
);

const sourcesContentStyles = StyleSheet.create({
  content: {
    marginTop: 12,
    gap: 8,
  },
});

/* --------------------------------- Source ---------------------------------- */

export type SourceProps = PressableProps & {
  className?: string;
  style?: ViewStyle;
  href?: string;
  title?: string;
  children?: React.ReactNode;
};

export const Source = ({
  href,
  title,
  children,
  className,
  style,
  ...props
}: SourceProps) => (
  <Pressable
    style={[sourceStyles.source, style]}
    accessibilityRole="link"
    accessibilityHint={href}
    {...props}
  >
    {children ?? (
      <>
        <BookOpen size={16} color="#6b7280" />
        <Text style={sourceStyles.text}>{title}</Text>
      </>
    )}
  </Pressable>
);

const sourceStyles = StyleSheet.create({
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});
