import React from 'react';
import { Handle, Position } from 'reactflow';
import { Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const BaseNode = ({ 
  data, 
  title,
  children, 
  className = '', 
  showHandles = true,
  icon: Icon = MapPin,
  colorScheme = 'gray',
  isDimmed = false
}) => {
  const handleClick = () => {
    if (data.onNodeClick) {
      data.onNodeClick(data);
    }
  };

  const getColorClasses = () => {
    if (isDimmed) {
      return {
        border: 'border-gray-300',
        header: 'bg-gray-100',
        iconBg: 'bg-gray-200',
        iconColor: 'text-gray-500',
        titleColor: 'text-gray-600',
        timestampColor: 'text-gray-400',
        shadowColor: 'shadow-sm',
      };
    }

    const colorMap = {
      purple: {
        border: 'border-purple-300',
        header: 'bg-purple-100',
        iconBg: 'bg-purple-200',
        iconColor: 'text-purple-700',
        titleColor: 'text-purple-900',
        timestampColor: 'text-purple-600',
        shadowColor: 'shadow-purple-200',
      },
      blue: {
        border: 'border-blue-300',
        header: 'bg-blue-100',
        iconBg: 'bg-blue-200',
        iconColor: 'text-blue-700',
        titleColor: 'text-blue-900',
        timestampColor: 'text-blue-600',
        shadowColor: 'shadow-blue-200',
      },
      teal: {
        border: 'border-teal-300',
        header: 'bg-teal-100',
        iconBg: 'bg-teal-200',
        iconColor: 'text-teal-700',
        titleColor: 'text-teal-900',
        timestampColor: 'text-teal-600',
        shadowColor: 'shadow-teal-200',
      },
      orange: {
        border: 'border-orange-300',
        header: 'bg-orange-100',
        iconBg: 'bg-orange-200',
        iconColor: 'text-orange-700',
        titleColor: 'text-orange-900',
        timestampColor: 'text-orange-600',
        shadowColor: 'shadow-orange-200',
      },
      green: {
        border: 'border-green-300',
        header: 'bg-green-100',
        iconBg: 'bg-green-200',
        iconColor: 'text-green-700',
        titleColor: 'text-green-900',
        timestampColor: 'text-green-600',
        shadowColor: 'shadow-green-200',
      },
      red: {
        border: 'border-red-300',
        header: 'bg-red-100',
        iconBg: 'bg-red-200',
        iconColor: 'text-red-700',
        titleColor: 'text-red-900',
        timestampColor: 'text-red-600',
        shadowColor: 'shadow-red-200',
      },
    };

    return colorMap[colorScheme] || colorMap.gray;
  };

  const colors = getColorClasses();

  return (
    <div 
      className={`
        bg-white rounded-lg border-2 shadow-lg cursor-pointer 
        transition-all duration-300 ease-in-out hover:shadow-xl
        ${colors.border} ${colors.shadowColor}
        ${isDimmed ? 'opacity-60 scale-95 hover:opacity-80' : 'hover:scale-105'}
      `}
      onClick={handleClick}
      style={{
        minWidth: '280px',
        maxWidth: '320px',
      }}
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
      
      <div className={`${colors.header} p-3 rounded-t-lg border-b border-gray-200`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`${colors.iconBg} p-2 rounded-lg`}>
            <Icon className={`w-4 h-4 ${colors.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm ${colors.titleColor} truncate`}>
              {title || data.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Clock className={`w-3 h-3 ${colors.timestampColor}`} />
              <span className={`text-xs ${colors.timestampColor}`}>
                {format(new Date(data.createdAt), 'HH:mm:ss')}
              </span>
              {data.position && (
                <span className={`text-xs ${colors.timestampColor} ml-2`}>
                  #{data.position}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-0">
        {children}
      </div>

      <div className="px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className={`${colors.timestampColor} font-medium`}>
            {data.partType.replace('_', ' ')}
          </span>
          <div className={`flex items-center gap-1 ${colors.timestampColor}`}>
            <div className={`w-2 h-2 rounded-full ${
              isDimmed ? 'bg-gray-400' : 
              colorScheme === 'purple' ? 'bg-purple-500' :
              colorScheme === 'blue' ? 'bg-blue-500' :
              colorScheme === 'teal' ? 'bg-teal-500' :
              colorScheme === 'orange' ? 'bg-orange-500' :
              colorScheme === 'green' ? 'bg-green-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-xs">{data.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseNode; 