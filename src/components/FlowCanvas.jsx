import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

import AssignmentNode from './NodeTypes/AssignmentNode';
import CommentNode from './NodeTypes/CommentNode';
import SystemNode from './NodeTypes/SystemNode';
import DetailsSidebar from './Sidebar/DetailsSidebar';
import LeftSidebar from './Sidebar/LeftSidebar';

const nodeTypes = {
  assignment: AssignmentNode,
  comment: CommentNode,
  system: SystemNode,
};

const FlowCanvas = ({ conversationData }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  // Transform conversation data into nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!conversationData?.parts) {
      return { initialNodes: [], initialEdges: [] };
    }

    const nodes = conversationData.parts.map((part, index) => {
      // Determine node type based on part type
      let nodeType = 'system';
      if (['default_assignment', 'assignment'].includes(part.partType)) {
        nodeType = 'assignment';
      } else if (part.partType === 'comment') {
        nodeType = 'comment';
      }

      // Generate title based on part type
      const getTitle = () => {
        switch (part.partType) {
          case 'customer_initiated':
            return 'Conversation Started';
          case 'default_assignment':
            return 'Default Assignment';
          case 'assignment':
            return 'Manual Assignment';
          case 'comment':
            return 'Message';
          case 'language_detection':
            return 'Language Detection';
          case 'conversation_attribute_updated':
            return 'Attribute Updated';
          default:
            return 'System Event';
        }
      };

      return {
        id: part.id,
        type: nodeType,
        position: { 
          x: Math.floor(index / 3) * 350, // Create columns every 3 nodes
          y: (index % 3) * 200 // Vertical spacing
        },
        data: {
          ...part,
          title: getTitle(),
          position: index + 1,
          onNodeClick: setSelectedNode,
        },
      };
    });

    // Create edges connecting sequential nodes
    const edges = conversationData.parts.slice(0, -1).map((part, index) => ({
      id: `e${part.id}-${conversationData.parts[index + 1].id}`,
      source: part.id,
      target: conversationData.parts[index + 1].id,
      type: 'smoothstep',
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      animated: false,
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [conversationData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Always visible */}
      <LeftSidebar conversationData={conversationData} />
      
      {/* Main Flow Area */}
      <div className={`flex-1 transition-all duration-300 ml-80 ${selectedNode ? 'mr-96' : 'mr-0'}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-tines-gray"
        >
          <Controls className="!bottom-4 !left-4" />
          <MiniMap
            className="!bottom-4 !right-4"
            nodeStrokeColor="#374151"
            nodeColor="#f3f4f6"
            nodeBorderRadius={8}
          />
          <Background 
            variant="dots" 
            gap={20} 
            size={1} 
            color="#e2e8f0"
          />
        </ReactFlow>
      </div>

      {/* Right Sidebar - Shows when node is selected */}
      <DetailsSidebar 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};

export default FlowCanvas; 