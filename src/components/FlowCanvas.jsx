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
import DetailsSidebar from './Sidebar/DetailsSidebar';
import LeftSidebar from './Sidebar/LeftSidebar';
import ConversationTable from './TableView/ConversationTable';
import { LayoutGrid, GitBranch, Eye } from 'lucide-react';

const nodeTypes = {
  assignment: AssignmentNode,
  comment: CommentNode,
  system: SystemNode,
  workflow: WorkflowNode,
};

const FlowCanvas = ({ conversationData }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('flow'); // 'flow' or 'table'

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

  // Create positions based on view mode
  const createNodePositions = (parts, workflows) => {
    const positions = [];
    
    // Flow layout: simple positioning logic
    parts.forEach((part, index) => {
      positions.push({
        x: 100 + (index % 2) * 450,
        y: 50 + Math.floor(index / 2) * 400,
      });
    });
    
    // Position workflows to the right in flow mode
    if (workflows) {
      workflows.forEach((workflow, index) => {
        positions.push({
          x: 800,
          y: 100 + index * 400,
        });
      });
    }
    
    return positions;
  };

  // Create initial nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!conversationData?.parts) {
      return { initialNodes: [], initialEdges: [] };
    }

    const positions = createNodePositions(
      conversationData.parts, 
      conversationData.workflows
    );

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

      return {
        id: part.id,
        type: nodeType,
        position: positions[index],
        data: {
          ...part,
          title: getTitle(),
          position: index + 1,
          onNodeClick: setSelectedNode,
          category: nodeCategory,
          isDimmed: false,
        },
        draggable: viewMode === 'flow', // Only allow dragging in flow mode
      };
    });

    // Initialize edges array
    const edges = [];

    // Create sequential edges for conversation parts (only in flow mode)
    if (viewMode === 'flow') {
      conversationData.parts.slice(0, -1).forEach((part, index) => {
        edges.push({
          id: `e${part.id}-${conversationData.parts[index + 1].id}`,
          source: part.id,
          target: conversationData.parts[index + 1].id,
          type: 'smoothstep',
          style: { 
            stroke: '#94a3b8', 
            strokeWidth: 2,
            opacity: 1,
            transition: 'all 0.3s ease-in-out'
          },
          animated: false,
        });
      });
    }

    // Create workflow nodes if they exist
    if (conversationData.workflows) {
      conversationData.workflows.forEach((workflow, index) => {
        const workflowNodeId = `workflow_${workflow.id}`;
        const workflowPositionIndex = conversationData.parts.length + index;
        
        nodes.push({
          id: workflowNodeId,
          type: 'workflow',
          position: positions[workflowPositionIndex],
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
          draggable: viewMode === 'flow', // Only allow dragging in flow mode
        });

        // Create dotted line connections from workflow to related parts (only in flow mode)
        if (viewMode === 'flow' && workflow.related_parts) {
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
  }, [conversationData, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when view mode or category selection changes
  useEffect(() => {
    if (!conversationData?.parts || viewMode !== 'flow') return;

    // Recalculate positions when view mode changes
    const positions = createNodePositions(
      conversationData.parts, 
      conversationData.workflows
    );

    // Update nodes with new positions and dimming based on selected category
    setNodes((currentNodes) => 
      currentNodes.map((node, index) => {
        const nodeCategory = getNodeCategory(node.data.partType);
        const isDimmed = selectedCategory !== 'all' && selectedCategory !== nodeCategory;
        
        // Determine the correct position index
        let positionIndex = index;
        if (node.data.partType === 'workflow') {
          // For workflow nodes, find their index in the workflows array
          const workflowIndex = conversationData.workflows?.findIndex(w => `workflow_${w.id}` === node.id) || 0;
          positionIndex = conversationData.parts.length + workflowIndex;
        }
        
        return {
          ...node,
          position: positions[positionIndex] || node.position,
          data: {
            ...node.data,
            isDimmed: isDimmed,
          },
          style: {
            opacity: isDimmed ? 0.3 : 1,
            transition: 'all 0.3s ease-in-out',
            filter: isDimmed ? 'grayscale(0.5)' : 'none',
          },
          className: isDimmed ? 'dimmed-node' : 'focused-node',
          draggable: true, // Always draggable in flow mode
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
            stroke: isDimmed ? '#e2e8f0' : '#94a3b8',
            strokeWidth: isDimmed ? 1 : 2,
            opacity: isDimmed ? 0.3 : 1,
            transition: 'all 0.3s ease-in-out'
          }
        };
      })
    );
  }, [selectedCategory, conversationData, viewMode, setNodes, setEdges]);

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

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    setSelectedNode(null); // Clear selected node when changing view
  }, []);

  // Handle table row click
  const handleTableRowClick = useCallback((event) => {
    setSelectedNode(event);
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
      <div className={`flex-1 transition-all duration-300 ml-80 ${selectedNode ? 'mr-96' : 'mr-0'} relative`}>
        {/* Navbar with View Toggle */}
        <div className="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('flow')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'flow' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  Flow
                </button>
                <button
                  onClick={() => handleViewModeChange('table')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  Table
                </button>
              </div>
            </div>

            {/* Category Filter Status */}
            {selectedCategory !== 'all' && (
              <>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Filtering: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </span>
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
              </>
            )}
          </div>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === 'table' ? (
          <div className="p-6 pt-20 h-full overflow-auto">
            <ConversationTable
              conversationData={conversationData}
              selectedCategory={selectedCategory}
              onRowClick={handleTableRowClick}
              selectedNode={selectedNode}
            />
          </div>
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
            panOnDrag={[1, 2]}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
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

      {/* Right Sidebar - Shows when node is selected */}
      <DetailsSidebar 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};

export default FlowCanvas; 