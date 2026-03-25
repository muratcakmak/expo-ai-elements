import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { WebView, type WebViewMessageEvent } from '../../../utils/webview-shim';

import { cn } from '../../utils/cn';

/* ---------------------------------- Types --------------------------------- */

type FlowNode = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
};

type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, string | number>;
};

type FlowCanvasProps = ViewProps & {
  className?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodeClick?: (nodeId: string, node: FlowNode) => void;
  onEdgeClick?: (edgeId: string, edge: FlowEdge) => void;
  fitView?: boolean;
};

/* --------------------------------- Bridge --------------------------------- */

type BridgeMessage =
  | { type: 'nodeClick'; nodeId: string; node: FlowNode }
  | { type: 'edgeClick'; edgeId: string; edge: FlowEdge };

const buildHtml = (nodes: FlowNode[], edges: FlowEdge[], fitView: boolean) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; }
    .react-flow__background { background-color: #f8f9fa; }
  </style>
  <link href="https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/umd/index.js"><\/script>
</head>
<body>
  <div id="root"></div>
  <script>
    var XYFlow = window.XYFlow || window.ReactFlow;
    var ReactFlowLib = XYFlow;

    var initialNodes = ${JSON.stringify(nodes)};
    var initialEdges = ${JSON.stringify(edges)};
    var shouldFitView = ${String(fitView)};

    function sendMessage(msg) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }
    }

    function App() {
      var e = React.createElement;
      return e(
        ReactFlowLib.ReactFlow,
        {
          nodes: initialNodes,
          edges: initialEdges,
          fitView: shouldFitView,
          deleteKeyCode: ['Backspace', 'Delete'],
          panOnDrag: false,
          panOnScroll: true,
          selectionOnDrag: true,
          zoomOnDoubleClick: false,
          onNodeClick: function(event, node) {
            sendMessage({ type: 'nodeClick', nodeId: node.id, node: node });
          },
          onEdgeClick: function(event, edge) {
            sendMessage({ type: 'edgeClick', edgeId: edge.id, edge: edge });
          }
        },
        e(ReactFlowLib.Background, { color: '#e0e0e0', gap: 16 })
      );
    }

    var root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));

    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'updateGraph') {
          initialNodes = data.nodes;
          initialEdges = data.edges;
          root.render(React.createElement(App));
        }
      } catch (err) {}
    });
  <\/script>
</body>
</html>
`;

/* -------------------------------- Component ------------------------------- */

function FlowCanvas({
  className,
  nodes,
  edges,
  onNodeClick,
  onEdgeClick,
  fitView = true,
  ...props
}: FlowCanvasProps) {
  const webViewRef = React.useRef<WebView>(null);

  const html = React.useMemo(
    () => buildHtml(nodes, edges, fitView),
    [nodes, edges, fitView],
  );

  const handleMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data: BridgeMessage = JSON.parse(event.nativeEvent.data);

        if (data.type === 'nodeClick') {
          onNodeClick?.(data.nodeId, data.node);
        } else if (data.type === 'edgeClick') {
          onEdgeClick?.(data.edgeId, data.edge);
        }
      } catch {
        // Ignore non-JSON messages
      }
    },
    [onNodeClick, onEdgeClick],
  );

  return (
    <View className={cn('flex-1', className)} {...props}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export {
  FlowCanvas,
  type FlowCanvasProps,
  type FlowNode,
  type FlowEdge,
};
