/**
 * Workflow components barrel export.
 *
 * OMC-76: FlowCanvas — WebView + @xyflow/react bridge
 * OMC-77: FlowNode — Node data type and custom node rendering
 * OMC-78: FlowEdge + FlowConnection — Edge and connection types
 * OMC-79: FlowControls, FlowPanel, FlowToolbar — Canvas overlays
 */

export {
  // Canvas
  FlowCanvas,
  type FlowCanvasProps,
  type FlowNode,
  type FlowEdge,

  // Node
  FlowNodeComponent,
  FlowNodeHeader,
  FlowNodeTitle,
  FlowNodeDescription,
  FlowNodeAction,
  FlowNodeContent,
  FlowNodeFooter,
  type FlowNodeProps,
  type FlowNodeHeaderProps,
  type FlowNodeTitleProps,
  type FlowNodeDescriptionProps,
  type FlowNodeActionProps,
  type FlowNodeContentProps,
  type FlowNodeFooterProps,
  type HandleConfig,

  // Edge
  createTemporaryEdge,
  createAnimatedEdge,
  type FlowEdgeConfig,
  type FlowEdgeStyle,
  type FlowPosition,

  // Connection
  getConnectionPath,
  type FlowConnectionLine,

  // Controls
  FlowControls,
  FlowControlButton,
  type FlowControlsProps,
  type FlowControlButtonProps,

  // Panel
  FlowPanel,
  type FlowPanelProps,
  type FlowPanelPosition,

  // Toolbar
  FlowToolbar,
  type FlowToolbarProps,
  type FlowToolbarPosition,
} from './canvas';
