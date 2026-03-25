/**
 * WebView shim for Expo Go compatibility.
 * react-native-webview is not included in Expo Go.
 * This shim renders a placeholder View.
 */
import React from 'react';
import { View, Text, type ViewProps } from 'react-native';

let RealWebView: any = null;
try {
  RealWebView = require('react-native-webview').WebView;
} catch {
  // Not available in Expo Go
}

export function WebView({ source, style, ...props }: any) {
  if (RealWebView) {
    return <RealWebView source={source} style={style} {...props} />;
  }
  return (
    <View style={[{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 100 }, style]}>
      <Text style={{ color: '#6b7280', fontSize: 13 }}>WebView (requires dev client)</Text>
      {source?.uri && <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 4 }}>{source.uri}</Text>}
    </View>
  );
}
