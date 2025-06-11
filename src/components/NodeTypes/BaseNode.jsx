import React from 'react';
import { Handle, Position } from 'reactflow';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const BaseNode = ({ 
  data, 
  children, 
  className = '', 
  showHandles = true,
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'border-blue-600 bg-blue-600',
    green: 'border-green-600 bg-green-600',
    orange: 'border-orange-600 bg-orange-600',
    purple: 'border-purple-600 bg-purple-600',
    gray: 'border-gray-600 bg-gray-600',
    teal: 'border-teal-600 bg-teal-600'
  };

  const iconColorClasses = {
    blue: 'text-white',
    green: 'text-white',
    orange: 'text-white',
    purple: 'text-white',
    gray: 'text-white',
    teal: 'text-white'
  };

  return (
    <div 
      className={`conversation-node p-4 min-w-[280px] max-w-[320px] rounded-lg shadow-sm ${colorClasses[color]} ${className}`}
      onClick={() => data.onNodeClick?.(data)}
    >
      {showHandles && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="w-2 h-2 !bg-gray-400 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-gray-400 border-2 border-white"
          />
        </>
      )}
      
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <Icon size={20} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white text-sm truncate">
              {data.title}
            </h3>
            <span className={`tines-badge text-xs bg-white bg-opacity-20 text-white border border-white border-opacity-30`}>
              {data.partType}
            </span>
          </div>
          
          <p className="text-white text-opacity-90 text-sm mb-3 line-clamp-2">
            {data.content}
          </p>
          
          {children}
          
          <div className="flex items-center justify-between text-xs text-white text-opacity-75 mt-3 pt-2 border-t border-white border-opacity-30">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{format(new Date(data.createdAt), 'MMM d, HH:mm')}</span>
            </div>
            {data.author && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span className="truncate max-w-[80px]">{data.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseNode; 