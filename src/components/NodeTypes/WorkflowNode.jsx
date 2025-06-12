import React from 'react';
import BaseNode from './BaseNode';
import { Workflow, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const WorkflowNode = ({ data }) => {
  const getWorkflowInfo = () => {
    const workflow = data.workflow;
    
    return {
      name: workflow.name,
      state: workflow.state,
      duration: calculateDuration(workflow.started_at, workflow.finished_at),
      steps: workflow.executed_controls?.length || 0,
      relatedParts: workflow.related_parts?.length || 0,
    };
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'Unknown';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffSeconds = Math.round(diffMs / 1000);
    return `${diffSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (data.workflow.state) {
      case 'completed':
        return CheckCircle;
      case 'running':
        return Play;
      case 'failed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = () => {
    switch (data.workflow.state) {
      case 'completed':
        return 'green';
      case 'running':
        return 'blue';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const workflowInfo = getWorkflowInfo();
  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();

  return (
    <BaseNode
      data={data}
      title={`Workflow: ${workflowInfo.name}`}
      colorScheme={statusColor}
      icon={Workflow}
      isDimmed={data.isDimmed}
    >
      <div className={`p-3 rounded-lg transition-all duration-300 ${
        data.isDimmed 
          ? 'bg-gray-50 border border-gray-200' 
          : statusColor === 'green' 
            ? 'bg-green-600 text-white'
            : statusColor === 'blue'
            ? 'bg-blue-600 text-white'
            : statusColor === 'red'
            ? 'bg-red-600 text-white'
            : 'bg-gray-600 text-white'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon className={`w-4 h-4 ${
            data.isDimmed ? 'text-gray-600' : 'text-white'
          }`} />
          <span className={`font-medium text-sm ${
            data.isDimmed ? 'text-gray-600' : 'text-white'
          }`}>
            {data.workflow.state.charAt(0).toUpperCase() + data.workflow.state.slice(1)}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            data.isDimmed 
              ? 'bg-gray-200 text-gray-600' 
              : 'bg-white bg-opacity-20 text-white'
          }`}>
            ID: {data.workflow.id}
          </span>
        </div>

        <div className={`space-y-2 text-xs ${
          data.isDimmed ? 'text-gray-500' : 'text-white text-opacity-90'
        }`}>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{workflowInfo.duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Steps executed:</span>
            <span className="font-medium">{workflowInfo.steps}</span>
          </div>
          <div className="flex justify-between">
            <span>Related parts:</span>
            <span className="font-medium">{workflowInfo.relatedParts}</span>
          </div>
          {data.workflow.entity && (
            <div className="mt-2 pt-2 border-t border-white border-opacity-20">
              <div className="text-xs">
                <span className="font-medium">Entity:</span>
                <div className="truncate">{data.workflow.entity}</div>
              </div>
            </div>
          )}
        </div>

        {data.workflow.executed_controls && data.workflow.executed_controls.length > 0 && (
          <div className={`mt-3 pt-2 border-t ${
            data.isDimmed 
              ? 'border-gray-300' 
              : 'border-white border-opacity-20'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              data.isDimmed ? 'text-gray-600' : 'text-white'
            }`}>
              Latest Step:
            </div>
            <div className={`text-xs ${
              data.isDimmed ? 'text-gray-500' : 'text-white text-opacity-75'
            }`}>
              {data.workflow.executed_controls[0].step}
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default WorkflowNode; 