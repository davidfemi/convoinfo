import React from 'react';
import { format } from 'date-fns';
import { 
  MessageSquare, Users, Settings, Globe, Tag, 
  CheckCircle, Clock, AlertCircle, Workflow 
} from 'lucide-react';

const ConversationTable = ({ 
  conversationData, 
  selectedCategory, 
  onRowClick, 
  selectedNode 
}) => {
  // Combine conversation parts and workflows into a single array
  const getAllEvents = () => {
    const events = [];
    
    // Add conversation parts
    if (conversationData?.parts) {
      conversationData.parts.forEach((part, index) => {
        events.push({
          ...part,
          eventType: 'conversation_part',
          position: index + 1,
        });
      });
    }
    
    // Add workflows
    if (conversationData?.workflows) {
      conversationData.workflows.forEach((workflow, index) => {
        events.push({
          id: `workflow_${workflow.id}`,
          partType: 'workflow',
          createdAt: workflow.started_at,
          author: 'System',
          channel: 'automation',
          content: `Workflow: ${workflow.name}`,
          eventType: 'workflow',
          position: conversationData.parts.length + index + 1,
          workflow: workflow,
        });
      });
    }
    
    // Sort by creation time
    return events.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const getEventIcon = (partType) => {
    switch (partType) {
      case 'customer_initiated':
        return MessageSquare;
      case 'default_assignment':
      case 'assignment':
        return Users;
      case 'comment':
        return MessageSquare;
      case 'language_detection':
        return Globe;
      case 'conversation_attribute_updated':
        return Tag;
      case 'workflow':
        return Workflow;
      case 'custom_action_started':
      case 'custom_action_finished':
        return Settings;
      default:
        return Settings;
    }
  };

  const getEventCategory = (partType) => {
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

  const getEventTitle = (event) => {
    switch (event.partType) {
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
      case 'workflow':
        return `Workflow: ${event.workflow?.name || 'Unknown'}`;
      default:
        return 'System Event';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'assignments':
        return 'text-purple-600 bg-purple-50';
      case 'comments':
        return 'text-blue-600 bg-blue-50';
      case 'workflows':
        return 'text-green-600 bg-green-50';
      case 'system':
        return 'text-teal-600 bg-teal-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getWorkflowStatus = (workflow) => {
    if (!workflow) return null;
    
    const statusConfig = {
      completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      running: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
      failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    };
    
    return statusConfig[workflow.state] || statusConfig.completed;
  };

  const events = getAllEvents();
  
  // Filter events based on selected category
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => getEventCategory(event.partType) === selectedCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event, index) => {
              const Icon = getEventIcon(event.partType);
              const category = getEventCategory(event.partType);
              const categoryColor = getCategoryColor(category);
              const isSelected = selectedNode?.id === event.id;
              const isDimmed = selectedCategory !== 'all' && selectedCategory !== category;
              const workflowStatus = getWorkflowStatus(event.workflow);
              
              return (
                <tr
                  key={event.id}
                  onClick={() => onRowClick(event)}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : isDimmed 
                        ? 'opacity-50 hover:opacity-75' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${categoryColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getEventTitle(event)}
                        </div>
                        {event.content && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {event.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
                      {category}
                    </span>
                    {workflowStatus && (
                      <div className="flex items-center mt-1">
                        <workflowStatus.icon className={`w-3 h-3 mr-1 ${workflowStatus.color}`} />
                        <span className={`text-xs ${workflowStatus.color}`}>
                          {event.workflow.state}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{format(new Date(event.createdAt), 'MMM d, yyyy')}</div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(event.createdAt), 'HH:mm:ss')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.author || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{event.channel}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.eventType === 'workflow' && event.workflow ? (
                      <div className="space-y-1">
                        <div>ID: {event.workflow.id}</div>
                        <div>Duration: {
                          event.workflow.started_at && event.workflow.finished_at
                            ? `${Math.round((new Date(event.workflow.finished_at) - new Date(event.workflow.started_at)) / 1000)}s`
                            : 'Unknown'
                        }</div>
                        <div>Related: {event.workflow.related_parts?.length || 0} parts</div>
                      </div>
                    ) : event.details ? (
                      <div className="space-y-1">
                        {Object.entries(event.details).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium">{key}:</span> {String(value).substring(0, 30)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No details</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No events found for the selected category.</div>
        </div>
      )}
    </div>
  );
};

export default ConversationTable; 