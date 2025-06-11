import React from 'react';
import { MessageCircle, User, Headphones } from 'lucide-react';
import BaseNode from './BaseNode';

const CommentNode = ({ data }) => {
  const isCustomer = data.details?.user_type === 'customer' || 
                    data.channel === 'messenger' && data.author !== 'Operator';

  const getCommentIcon = () => {
    return isCustomer ? User : Headphones;
  };

  // Always use blue for all comments to ensure distinct colors:
  // Assignments = Purple, Comments = Blue, Conversation Started = Green
  const getCommentColor = () => {
    return 'blue';
  };

  const getCommentDetails = () => {
    return (
      <div className="bg-white bg-opacity-20 rounded p-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isCustomer ? 'bg-white' : 'bg-white'
          }`}></div>
          <span className="font-medium text-white">
            {isCustomer ? 'Customer' : 'Agent'} Message
          </span>
        </div>
        <div className="text-white text-opacity-90 mt-1">
          Channel: {data.channel}
        </div>
      </div>
    );
  };

  return (
    <BaseNode 
      data={data} 
      icon={getCommentIcon()} 
      color={getCommentColor()}
    >
      {getCommentDetails()}
    </BaseNode>
  );
};

export default CommentNode; 