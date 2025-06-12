import React from 'react';
import { Handle, Position } from 'reactflow';
import { format } from 'date-fns';

const BasicNode = ({ data }) => {
  const handleClick = () => {
    if (data.onNodeClick) {
      data.onNodeClick(data);
    }
  };

  const getBasicColor = () => {
    if (data.isDimmed) return 'bg-gray-200 border-gray-300 text-gray-600';
    
    switch (data.category) {
      case 'assignments':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'comments':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'workflows':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'system':
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTypeLabel = () => {
    switch (data.partType) {
      case 'customer_initiated':
        return 'Start';
      case 'default_assignment':
        return 'Auto Assign';
      case 'assignment':
        return 'Assign';
      case 'comment':
        return 'Message';
      case 'language_detection':
        return 'Language';
      case 'conversation_attribute_updated':
        return 'Update';
      case 'custom_action_started':
        return 'Action Start';
      case 'custom_action_finished':
        return 'Action End';
      case 'workflow':
        return 'Workflow';
      default:
        return 'Event';
    }
  };

  return (
    <div 
      className={`
        rounded-lg border-2 cursor-pointer transition-all duration-200
        hover:shadow-md min-w-[120px] max-w-[160px] p-3
        ${getBasicColor()}
        ${data.isDimmed ? 'opacity-60 scale-95' : 'hover:scale-105'}
      `}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-400 border-2 border-white opacity-0 hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-400 border-2 border-white opacity-0 hover:opacity-100"
      />
      
      <div className="text-center">
        <div className="font-medium text-sm mb-1">
          {getTypeLabel()}
        </div>
        <div className="text-xs opacity-75">
          #{data.position}
        </div>
        <div className="text-xs opacity-60 mt-1">
          {format(new Date(data.createdAt), 'HH:mm')}
        </div>
        {data.workflow && (
          <div className="text-xs font-medium mt-1 truncate">
            {data.workflow.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicNode; 