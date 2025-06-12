import React from 'react';
import BaseNode from './BaseNode';
import { Users } from 'lucide-react';

const AssignmentNode = ({ data }) => {
  const getAssignmentDetails = () => {
    if (data.partType === 'default_assignment') {
      return {
        type: 'Auto Assignment',
        description: 'Automatically assigned based on rules',
        icon: '🤖',
      };
    } else {
      return {
        type: 'Manual Assignment',
        description: 'Manually assigned by team member',
        icon: '👤',
      };
    }
  };

  const assignmentInfo = getAssignmentDetails();

  return (
    <BaseNode
      data={data}
      title={data.title}
      colorScheme="purple"
      icon={Users}
      isDimmed={data.isDimmed}
    >
      <div className={`p-3 rounded-lg transition-all duration-300 ${
        data.isDimmed 
          ? 'bg-gray-50 border border-gray-200' 
          : 'bg-purple-600 text-white'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{assignmentInfo.icon}</span>
          <span className={`font-medium text-sm ${
            data.isDimmed ? 'text-gray-600' : 'text-white'
          }`}>
            {assignmentInfo.type}
          </span>
        </div>
        <p className={`text-xs ${
          data.isDimmed ? 'text-gray-500' : 'text-purple-100'
        }`}>
          {assignmentInfo.description}
        </p>
        {data.assignee && (
          <div className={`mt-2 text-xs ${
            data.isDimmed ? 'text-gray-600' : 'text-purple-100'
          }`}>
            Assigned to: {data.assignee}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default AssignmentNode; 