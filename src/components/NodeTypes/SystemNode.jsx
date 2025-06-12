import React from 'react';
import BaseNode from './BaseNode';
import { Settings, Globe, Tag, MessageCircle } from 'lucide-react';

const SystemNode = ({ data }) => {
  const getSystemEventInfo = () => {
    switch (data.partType) {
      case 'customer_initiated':
        return {
          type: 'Conversation Started',
          description: 'Customer initiated conversation',
          icon: '💬',
          color: 'teal',
          lucideIcon: MessageCircle,
        };
      case 'language_detection':
        return {
          type: 'Language Detection',
          description: 'Automated language identification',
          icon: '🌐',
          color: 'teal',
          lucideIcon: Globe,
        };
      case 'conversation_attribute_updated':
        return {
          type: 'Attribute Update',
          description: 'Conversation properties modified',
          icon: '🏷️',
          color: 'orange',
          lucideIcon: Tag,
        };
      default:
        return {
          type: 'System Event',
          description: 'Automated system action',
          icon: '⚙️',
          color: 'teal',
          lucideIcon: Settings,
        };
    }
  };

  const eventInfo = getSystemEventInfo();

  return (
    <BaseNode
      data={data}
      title={data.title}
      colorScheme={eventInfo.color}
      icon={eventInfo.lucideIcon}
      isDimmed={data.isDimmed}
    >
      <div className={`p-3 rounded-lg transition-all duration-300 ${
        data.isDimmed 
          ? 'bg-gray-50 border border-gray-200' 
          : eventInfo.color === 'teal' 
            ? 'bg-teal-600 text-white'
            : 'bg-orange-600 text-white'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{eventInfo.icon}</span>
          <span className={`font-medium text-sm ${
            data.isDimmed ? 'text-gray-600' : 'text-white'
          }`}>
            {eventInfo.type}
          </span>
        </div>
        <p className={`text-xs ${
          data.isDimmed 
            ? 'text-gray-500' 
            : eventInfo.color === 'teal' 
              ? 'text-teal-100'
              : 'text-orange-100'
        }`}>
          {eventInfo.description}
        </p>
        {data.details && Object.keys(data.details).length > 0 && (
          <div className={`mt-2 text-xs ${
            data.isDimmed 
              ? 'text-gray-600' 
              : eventInfo.color === 'teal' 
                ? 'text-teal-100'
                : 'text-orange-100'
          }`}>
            {Object.entries(data.details).slice(0, 2).map(([key, value]) => (
              <div key={key} className="truncate">
                <span className="font-medium">{key}:</span> {String(value).substring(0, 30)}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default SystemNode; 