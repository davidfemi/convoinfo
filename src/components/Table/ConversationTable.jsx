import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  ChevronUp, ChevronDown, MessageSquare, Users, Settings, 
  Workflow, Clock, User, Bot, Tag, Globe, Play, CheckCircle 
} from 'lucide-react';

const ConversationTable = ({ conversationData, selectedCategory, onRowClick, selectedNode }) => {
  const [sortField, setSortField] = useState('position');
  const [sortDirection, setSortDirection] = useState('asc');

  // Get icon for event type
  const getEventIcon = (partType, category) => {
    switch (partType) {
      case 'customer_initiated':
        return <Play className="w-4 h-4 text-teal-600" />;
      case 'default_assignment':
      case 'assignment':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'language_detection':
        return <Globe className="w-4 h-4 text-teal-600" />;
      case 'conversation_attribute_updated':
        return <Tag className="w-4 h-4 text-orange-600" />;
      case 'custom_action_started':
      case 'custom_action_finished':
        return <Bot className="w-4 h-4 text-teal-600" />;
      case 'workflow':
        return <Workflow className="w-4 h-4 text-green-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get event type label
  const getEventTypeLabel = (partType) => {
    switch (partType) {
      case 'customer_initiated':
        return 'Conversation Started';
      case 'default_assignment':
        return 'Auto Assignment';
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
        return 'Workflow';
      default:
        return 'System Event';
    }
  };

  // Get category for filtering
  const getCategory = (partType) => {
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

  // Prepare table data
  const tableData = useMemo(() => {
    const events = [];
    
    // Add conversation parts
    if (conversationData?.parts) {
      conversationData.parts.forEach((part, index) => {
        events.push({
          id: part.id,
          position: index + 1,
          type: 'event',
          partType: part.partType,
          category: getCategory(part.partType),
          timestamp: part.createdAt,
          author: part.author || 'System',
          content: part.content || '',
          details: part.details,
          data: part
        });
      });
    }

    // Add workflows
    if (conversationData?.workflows) {
      conversationData.workflows.forEach((workflow, index) => {
        events.push({
          id: `workflow_${workflow.id}`,
          position: (conversationData.parts?.length || 0) + index + 1,
          type: 'workflow',
          partType: 'workflow',
          category: 'workflows',
          timestamp: workflow.started_at,
          author: 'System',
          content: `Workflow: ${workflow.name}`,
          details: workflow,
          data: { workflow, partType: 'workflow' }
        });
      });
    }

    return events;
  }, [conversationData]);

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') return tableData;
    return tableData.filter(item => item.category === selectedCategory);
  }, [tableData, selectedCategory]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort header component
  const SortHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <SortHeader field="position">#</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <SortHeader field="timestamp">Time</SortHeader>
              <SortHeader field="author">Author</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item) => (
              <tr 
                key={item.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedNode?.id === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onRowClick(item.data)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {getEventIcon(item.partType, item.category)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getEventTypeLabel(item.partType)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {item.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{format(new Date(item.timestamp), 'HH:mm:ss')}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(item.timestamp), 'MMM d, yyyy')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {item.author.includes('🤖') ? (
                      <Bot className="w-4 h-4 text-blue-500" />
                    ) : item.author.includes('customer') ? (
                      <User className="w-4 h-4 text-green-500" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-900 truncate max-w-[120px]">
                      {item.author}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate">
                    {item.content}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs">
                    {item.type === 'workflow' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs">
                          {item.details.state} • {item.details.related_parts?.length || 0} parts
                        </span>
                      </div>
                    ) : item.details ? (
                      <div className="text-xs">
                        {Object.keys(item.details).slice(0, 2).map(key => (
                          <div key={key} className="truncate">
                            <span className="font-medium">{key}:</span> {String(item.details[key]).substring(0, 30)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No details</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No events found for the selected category.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationTable; 