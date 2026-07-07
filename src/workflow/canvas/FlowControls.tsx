import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import type { WebView } from 'react-native-webview';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';

/* ---------------------------------- Types --------------------------------- */

type FlowControlsProps = ViewProps & {
  className?: string;
  webViewRef?: React.RefObject<WebView | null>;
};

type FlowControlButtonProps = ButtonProps & {
  className?: string;
};

/* -------------------------------- Component ------------------------------- */

/**
 * Controls overlay for the FlowCanvas.
 * Renders zoom in, zoom out, and fit view buttons positioned absolutely.
 * When a webViewRef is provided, buttons inject JS to control the React Flow instance.
 */
function FlowControls({ className, webViewRef, children, ...props }: FlowControlsProps) {
  const injectJS = React.useCallback(
    (js: string) => {
      webViewRef?.current?.injectJavaScript(`${js}; true;`);
    },
    [webViewRef],
  );

  return (
    <View
      className={cn(
        'absolute bottom-4 left-4 flex-col gap-px overflow-hidden rounded-md border border-border bg-card p-1',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <FlowControlButton onPress={() => injectJS('document.querySelector(".react-flow__controls-zoomin")?.click()')}>
            {/* ZoomIn text label */}
          </FlowControlButton>
          <FlowControlButton onPress={() => injectJS('document.querySelector(".react-flow__controls-zoomout")?.click()')}>
            {/* ZoomOut text label */}
          </FlowControlButton>
          <FlowControlButton onPress={() => injectJS('document.querySelector(".react-flow__controls-fitview")?.click()')}>
            {/* FitView text label */}
          </FlowControlButton>
        </>
      )}
    </View>
  );
}

function FlowControlButton({ className, ...props }: FlowControlButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn('rounded-md', className)}
      {...props}
    />
  );
}

export {
  FlowControls,
  FlowControlButton,
  type FlowControlsProps,
  type FlowControlButtonProps,
};
