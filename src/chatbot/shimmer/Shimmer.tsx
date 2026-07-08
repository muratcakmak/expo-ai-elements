import React, { memo, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

export type ShimmerProps = TextProps & {
  className?: string;
  style?: TextStyle;
  children: string;
  /** Animation cycle duration in seconds (default 2) */
  duration?: number;
};

const ShimmerComponent = ({
  children,
  className,
  duration = 2,
  style,
  ...props
}: ShimmerProps) => {
  // Lazily create a single Animated.Value; useState avoids reading a ref
  // during render (react-hooks/refs) while keeping the value stable.
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      { iterations: -1 },
    );
    animation.start();

    return () => animation.stop();
  }, [opacity, duration]);

  return (
    <Animated.View style={{ opacity }}>
      <Text
        style={[styles.text, style]}
        {...props}
      >
        {children}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export const Shimmer = memo(ShimmerComponent);
Shimmer.displayName = 'Shimmer';
