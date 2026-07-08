import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

type DemoErrorBoundaryProps = {
  children: React.ReactNode;
  /** Short label describing what failed (e.g. the component name). */
  label?: string;
};

type DemoErrorBoundaryState = {
  error: Error | null;
};

/**
 * Tiny class error boundary for the scenario-test routes.
 *
 * Instead of letting one broken native mount redbox the whole route, it
 * catches the render error and shows the message in red text so the rest of
 * the screen (and hot-reload) keeps working.
 */
export class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  constructor(props: DemoErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): DemoErrorBoundaryState {
    return { error };
  }

  render(): React.ReactNode {
    const { error } = this.state;
    const { children, label } = this.props;

    if (error) {
      return (
        <ScrollView
          style={{ maxHeight: 260 }}
          contentContainerStyle={{
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#fca5a5',
            backgroundColor: '#fef2f2',
          }}
        >
          <Text style={{ color: '#b91c1c', fontWeight: '700', marginBottom: 6 }}>
            {label ?? 'Render error'}
          </Text>
          <Text
            style={{ color: '#dc2626', fontFamily: 'monospace', fontSize: 12 }}
            selectable
          >
            {error.message}
          </Text>
          {error.stack ? (
            <>
              <Text
                style={{ color: '#b91c1c', fontSize: 11, marginTop: 8 }}
              >
                Stack trace
              </Text>
              <Text
                style={{
                  color: '#dc2626',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  marginTop: 2,
                }}
                selectable
              >
                {error.stack}
              </Text>
            </>
          ) : null}
          <Pressable
            onPress={() => this.setState({ error: null })}
            style={{
              alignSelf: 'flex-start',
              marginTop: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#b91c1c',
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: '#b91c1c', fontWeight: '600', fontSize: 12 }}>
              Try again
            </Text>
          </Pressable>
        </ScrollView>
      );
    }

    return children;
  }
}
