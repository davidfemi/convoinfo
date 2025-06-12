import React, { useCallback, useMemo, useState, useEffect } from 'react';
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
import WorkflowNode from './NodeTypes/WorkflowNode';
import BasicNode from './NodeTypes/BasicNode';
import DetailsSidebar from './Sidebar/DetailsSidebar';
import LeftSidebar from './Sidebar/LeftSidebar';
import Navbar from './Navbar/Navbar';
import ConversationTable from './Table/ConversationTable';

const FlowCanvas = ({ conversationData }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBasicView, setIsBasicView] = useState(false);

  // Node types for detailed view
  const detailedNodeTypes = {
    assignment: AssignmentNode,
    comment: CommentNode,
    system: SystemNode,
    workflow: WorkflowNode,
  };

  // Node types for basic view
  const basicNodeTypes = {
    assignment: BasicNode,
    comment: BasicNode,
    system: BasicNode,
    workflow: BasicNode,
  };

  // Choose node types based on view mode
  const nodeTypes = isBasicView ? basicNodeTypes : detailedNodeTypes;

  // Determine which category a node belongs to
  const getNodeCategory = (partType) => {
    if (['default_assignment', 'assignment'].includes(partType)) {
      return 'assignments';
    } else if (partType === 'comment') {
      return 'comments';
    } else if (partType === 'workflow') {
      return 'workflows';
    } else {
      return 'system';
    }
  };

  // Create initial nodes and edges (only depends on conversationData, not selectedCategory)
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
          case 'custom_action_started':
            return 'Custom Action Started';
          case 'custom_action_finished':
            return 'Custom Action Finished';
          default:
            return 'System Event';
        }
      };

      const nodeCategory = getNodeCategory(part.partType);
      
      // Calculate position based on view mode
      const nodePosition = isBasicView 
        ? {
            x: 50 + (index % 4) * 200, // 4 columns for basic view
            y: 50 + Math.floor(index / 4) * 150 // Tighter spacing
          }
        : {
            x: 100 + (index % 2) * 450, // Current detailed view positioning
            y: 50 + Math.floor(index / 2) * 400
          };

      return {
        id: part.id,
        type: nodeType,
        position: nodePosition,
        data: {
          ...part,
          title: getTitle(),
          position: index + 1,
          onNodeClick: setSelectedNode,
          category: nodeCategory,
          isDimmed: false,
        },
        draggable: true,
      };
    });

    // Initialize edges array
    const edges = [];

    // Create sequential edges for conversation parts with enhanced styling
    conversationData.parts.slice(0, -1).forEach((part, index) => {
      edges.push({
        id: `e${part.id}-${conversationData.parts[index + 1].id}`,
        source: part.id,
        target: conversationData.parts[index + 1].id,
        type: 'smoothstep',
        style: { 
          stroke: isBasicView ? '#cbd5e1' : '#94a3b8', 
          strokeWidth: isBasicView ? 1 : 2,
          opacity: 1,
          transition: 'all 0.3s ease-in-out'
        },
        animated: false,
      });
    });

    // Create workflow nodes if they exist (only in detailed view)
    if (conversationData.workflows && !isBasicView) {
      conversationData.workflows.forEach((workflow, index) => {
        const workflowNodeId = `workflow_${workflow.id}`;
        
        nodes.push({
          id: workflowNodeId,
          type: 'system',
          position: {
            x: 800, // Move workflows further right to avoid conflicts
            y: 100 + index * 400 // Larger spacing for workflows
          },
          data: {
            id: workflowNodeId,
            title: `Workflow: ${workflow.name}`,
            partType: 'workflow',
            createdAt: workflow.started_at,
            workflow: workflow,
            position: conversationData.parts.length + index + 1,
            onNodeClick: setSelectedNode,
            category: 'workflows',
            isDimmed: false,
          },
        });

        // Create dotted line connections from workflow to related parts
        if (workflow.related_parts) {
          workflow.related_parts.forEach(partId => {
            edges.push({
              id: `workflow_${workflow.id}_to_${partId}`,
              source: workflowNodeId,
              target: partId,
              type: 'smoothstep',
              style: {
                stroke: '#9333ea',
                strokeWidth: 2,
                strokeDasharray: '5,5',
                opacity: 0.7,
                transition: 'all 0.3s ease-in-out'
              },
              animated: true,
            });
          });
        }
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [conversationData, isBasicView]); // Depend on both conversationData and isBasicView

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when view mode or category selection changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Update node and edge styling when category selection changes
  useEffect(() => {
    if (!conversationData?.parts) return;

    // Update nodes with dimming based on selected category
    setNodes((currentNodes) => 
      currentNodes.map((node) => {
        const nodeCategory = getNodeCategory(node.data.partType);
        const isDimmed = selectedCategory !== 'all' && selectedCategory !== nodeCategory;
        
        return {
          ...node,
          data: {
            ...node.data,
            isDimmed: isDimmed,
          },
          style: {
            opacity: isDimmed ? 0.3 : 1,
            transition: 'all 0.3s ease-in-out',
            filter: isDimmed ? 'grayscale(0.5)' : 'none',
          },
          className: isDimmed ? 'dimmed-node' : 'focused-node'
        };
      })
    );

    // Update edges with dimming
    setEdges((currentEdges) => 
      currentEdges.map((edge) => {
        // Handle workflow edges differently
        if (edge.id.includes('workflow_')) {
          const isDimmed = selectedCategory !== 'all' && selectedCategory !== 'workflows';
          return {
            ...edge,
            style: {
              ...edge.style,
              opacity: isDimmed ? 0.2 : 0.7,
              strokeDasharray: '5,5', // Keep dotted
            }
          };
        }

        // Handle regular conversation flow edges
        const sourcePart = conversationData.parts.find(p => p.id === edge.source);
        const targetPart = conversationData.parts.find(p => p.id === edge.target);
        
        if (!sourcePart || !targetPart) return edge;
        
        const sourceCategory = getNodeCategory(sourcePart.partType);
        const targetCategory = getNodeCategory(targetPart.partType);
        
        // Dim edge if either source or target node is dimmed
        const isDimmed = selectedCategory !== 'all' && 
                        selectedCategory !== sourceCategory && 
                        selectedCategory !== targetCategory;

        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isDimmed ? '#e2e8f0' : (isBasicView ? '#cbd5e1' : '#94a3b8'),
            strokeWidth: isDimmed ? 1 : (isBasicView ? 1 : 2),
            opacity: isDimmed ? 0.3 : 1,
            transition: 'all 0.3s ease-in-out'
          }
        };
      })
    );
  }, [selectedCategory, conversationData, setNodes, setEdges, isBasicView]);

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

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedNode(null); // Clear selected node when changing category
  }, []);

  const handleToggleView = useCallback((basicView) => {
    setIsBasicView(basicView);
    setSelectedNode(null); // Clear selected node when changing view
  }, []);

  // Get category stats for display
  const getCategoryStats = () => {
    if (!conversationData?.parts) return {};
    
    const stats = {
      total: conversationData.parts.length + (conversationData.workflows?.length || 0),
      assignments: conversationData.parts.filter(p => ['default_assignment', 'assignment'].includes(p.partType)).length,
      comments: conversationData.parts.filter(p => p.partType === 'comment').length,
      system: conversationData.parts.filter(p => !['default_assignment', 'assignment', 'comment'].includes(p.partType)).length,
      workflows: conversationData.workflows?.length || 0,
    };
    
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Always visible */}
      <LeftSidebar 
        conversationData={conversationData}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80">
        {/* Navbar */}
        <Navbar 
          isBasicView={isBasicView}
          onToggleView={handleToggleView}
          conversationData={conversationData}
        />
        
        {/* Content Area - Table or Flow */}
        <div className={`flex-1 transition-all duration-300 ${selectedNode ? 'mr-96' : 'mr-0'} relative mt-16`}>
          {/* Category Filter Status Bar */}
          {selectedCategory !== 'all' && (
            <div className="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Filtering: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedCategory === 'assignments' && `${stats.assignments} of ${stats.total} events`}
                  {selectedCategory === 'comments' && `${stats.comments} of ${stats.total} events`}
                  {selectedCategory === 'system' && `${stats.system} of ${stats.total} events`}
                  {selectedCategory === 'workflows' && `${stats.workflows} of ${stats.total} events`}
                </div>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Conditional rendering based on view mode */}
          {isBasicView ? (
            <ConversationTable
              conversationData={conversationData}
              selectedCategory={selectedCategory}
              onRowClick={setSelectedNode}
              selectedNode={selectedNode}
            />
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              className="bg-tines-gray"
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              minZoom={0.1}
              maxZoom={2}
            >
              <Controls className="!bottom-4 !left-4" />
              <MiniMap
                className="!bottom-4 !right-4"
                nodeStrokeColor="#374151"
                nodeColor={(node) => {
                  if (node.className === 'dimmed-node') return '#e5e7eb';
                  if (node.data.category === 'assignments') return '#a855f7';
                  if (node.data.category === 'comments') return '#3b82f6';
                  if (node.data.category === 'system') return '#14b8a6';
                  if (node.data.category === 'workflows') return '#9333ea';
                  return '#f3f4f6';
                }}
                nodeBorderRadius={8}
              />
              <Background 
                variant="dots" 
                gap={20} 
                size={1} 
                color="#e2e8f0"
              />
            </ReactFlow>
          )}
        </div>
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