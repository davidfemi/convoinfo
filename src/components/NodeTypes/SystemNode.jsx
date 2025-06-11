import React from 'react';
import { Cog, Globe, Tag, Play } from 'lucide-react';
import BaseNode from './BaseNode';

const SystemNode = ({ data }) => {
  const getSystemIcon = () => {
    switch (data.partType) {
      case 'language_detection':
        return Globe;
      case 'conversation_attribute_updated':
        return Tag;
      case 'customer_initiated':
        return Play;
      default:
        return Cog;
    }
  };

  const getSystemDetails = () => {
    const details = data.details || {};
    
    switch (data.partType) {
      case 'language_detection':
        return (
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
            <div className="font-medium text-white">Language Detected</div>
            <div className="text-white text-opacity-90">
              {details.detected_language?.toUpperCase() || 'Unknown'}
            </div>
            {details.confidence && (
              <div className="text-white text-opacity-75 mt-1">
                Confidence: {(details.confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        );
      
      case 'conversation_attribute_updated':
        return (
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
            <div className="font-medium text-white">Attribute Updated</div>
            <div className="text-white text-opacity-90">
              {details.attribute}: {details.new_value}
            </div>
            {details.updated_by && (
              <div className="text-white text-opacity-75 mt-1">
                By: {details.updated_by}
              </div>
            )}
          </div>
        );

      case 'customer_initiated':
        return (
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
            <div className="font-medium text-white">Conversation Started</div>
            <div className="text-white text-opacity-90">
              Source: {details.source || 'messenger'}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
            <div className="font-medium text-white">System Event</div>
            <div className="text-white text-opacity-90">Automated action</div>
          </div>
        );
    }
  };

  const getSystemColor = () => {
    switch (data.partType) {
      case 'customer_initiated':
        return 'teal';
      case 'language_detection':
        return 'blue';
      case 'conversation_attribute_updated':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <BaseNode 
      data={data} 
      icon={getSystemIcon()} 
      color={getSystemColor()}
    >
      {getSystemDetails()}
    </BaseNode>
  );
};

export default SystemNode; 