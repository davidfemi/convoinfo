import React from 'react';
import { UserCheck, Users, Settings } from 'lucide-react';
import BaseNode from './BaseNode';

const AssignmentNode = ({ data }) => {
  const getAssignmentIcon = () => {
    if (data.partType === 'default_assignment') return Settings;
    if (data.partType === 'assignment') return UserCheck;
    return Users;
  };

  const getAssignmentDetails = () => {
    const details = data.details || {};
    
    if (details.assignee) {
      return (
        <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
          <div className="font-medium text-white">Assigned to:</div>
          <div className="text-white text-opacity-90">{details.assignee.label}</div>
          {details.admin_assignee && (
            <div className="text-white text-opacity-75 mt-1">
              Admin: {details.admin_assignee.label}
            </div>
          )}
        </div>
      );
    }

    if (details.assigned_to) {
      return (
        <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
          <div className="font-medium text-white">Manual Assignment</div>
          <div className="text-white text-opacity-90">To: {details.assigned_to}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <BaseNode 
      data={data} 
      icon={getAssignmentIcon()} 
      color="purple"
    >
      {getAssignmentDetails()}
    </BaseNode>
  );
};

export default AssignmentNode; 