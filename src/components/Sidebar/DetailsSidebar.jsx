import React from 'react';
import { X, Clock, User, MessageCircle, Tag, Globe, Settings } from 'lucide-react';
import { format } from 'date-fns';

const DetailsSidebar = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  const getNodeIcon = () => {
    switch (selectedNode.partType) {
      case 'customer_initiated':
        return MessageCircle;
      case 'default_assignment':
      case 'assignment':
        return Settings;
      case 'comment':
        return MessageCircle;
      case 'language_detection':
        return Globe;
      case 'conversation_attribute_updated':
        return Tag;
      default:
        return MessageCircle;
    }
  };

  const Icon = getNodeIcon();

  const renderDetails = () => {
    const details = selectedNode.details || {};
    
    return (
      <div className="space-y-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 capitalize mb-1">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="text-sm text-gray-600">
              {typeof value === 'object' ? (
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                String(value)
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getNodeTypeInfo = () => {
    switch (selectedNode.partType) {
      case 'customer_initiated':
        return {
          label: 'Conversation Started',
          description: 'Initial customer contact that began this conversation',
          color: 'teal'
        };
      case 'default_assignment':
        return {
          label: 'Auto Assignment',
          description: 'Automatically assigned based on rules and conditions',
          color: 'purple'
        };
      case 'assignment':
        return {
          label: 'Manual Assignment',
          description: 'Manually assigned by a team member',
          color: 'purple'
        };
      case 'comment':
        return {
          label: 'Message',
          description: 'Communication between customer and support team',
          color: 'blue'
        };
      case 'language_detection':
        return {
          label: 'Language Detection',
          description: 'Automated language identification process',
          color: 'blue'
        };
      case 'conversation_attribute_updated':
        return {
          label: 'Attribute Update',
          description: 'Conversation properties were modified',
          color: 'orange'
        };
      default:
        return {
          label: 'System Event',
          description: 'Automated system action',
          color: 'gray'
        };
    }
  };

  const nodeInfo = getNodeTypeInfo();

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${nodeInfo.color}-100 rounded-lg`}>
              <Icon className={`w-5 h-5 text-${nodeInfo.color}-600`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedNode.title}
              </h2>
              <p className="text-sm text-gray-500">{nodeInfo.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Node Type Information */}
        <div className="mb-6">
          <div className={`bg-${nodeInfo.color}-50 border border-${nodeInfo.color}-200 rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 text-${nodeInfo.color}-600`} />
              <span className={`font-medium text-${nodeInfo.color}-900`}>{nodeInfo.label}</span>
              <span className={`bg-${nodeInfo.color}-100 text-${nodeInfo.color}-700 text-xs px-2 py-1 rounded`}>
                {selectedNode.partType}
              </span>
            </div>
            <p className={`text-sm text-${nodeInfo.color}-700`}>{nodeInfo.description}</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Event ID:</span>
                <span className="text-gray-900 font-mono text-xs">{selectedNode.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-900">
                  {format(new Date(selectedNode.createdAt), 'MMM d, yyyy HH:mm:ss')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Channel:</span>
                <span className="text-gray-900 capitalize">{selectedNode.channel}</span>
              </div>
              {selectedNode.author && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Author:</span>
                  <span className="text-gray-900">{selectedNode.author}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Position:</span>
                <span className="text-gray-900">
                  Event #{selectedNode.position || 'Unknown'} in flow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {selectedNode.content && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Content</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.content}</p>
            </div>
          </div>
        )}

        {/* Detailed Properties */}
        {selectedNode.details && Object.keys(selectedNode.details).length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Properties</h3>
            {renderDetails()}
          </div>
        )}

        {/* Timeline Context */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Timeline Context</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-blue-800 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                Event #{selectedNode.position || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              This event occurred in chronological order within the conversation flow. 
              Use the flow view to see relationships with other events.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              📋 Copy Event ID
            </button>
            <button className="w-full text-left text-sm text-green-700 hover:text-green-900 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              🔍 View in Logs
            </button>
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              📊 Analyze Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSidebar; 