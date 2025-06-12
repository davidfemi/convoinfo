import React from 'react';
import { MessageSquare } from 'lucide-react';
import BaseNode from './BaseNode';

const CommentNode = ({ data }) => {
  const getCommentDetails = () => {
    const details = data.details || {};
    
    return {
      author: details.author?.label || data.author || 'Unknown',
      isCustomer: details.author?.type === 'customer' || data.author?.includes('customer'),
      content: details.content || data.content || 'No message content',
      timestamp: data.createdAt,
    };
  };

  const commentInfo = getCommentDetails();

  return (
    <BaseNode
      data={data}
      title={data.title}
      colorScheme="blue"
      icon={MessageSquare}
      isDimmed={data.isDimmed}
    >
      <div className={`p-3 rounded-lg transition-all duration-300 ${
        data.isDimmed 
          ? 'bg-gray-50 border border-gray-200' 
          : 'bg-blue-600 text-white'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">
            {commentInfo.isCustomer ? '👤' : '🎧'}
          </span>
          <span className={`font-medium text-sm ${
            data.isDimmed ? 'text-gray-600' : 'text-white'
          }`}>
            {commentInfo.isCustomer ? 'Customer' : 'Agent'}
          </span>
        </div>
        <div className={`text-xs mb-2 ${
          data.isDimmed ? 'text-gray-600' : 'text-blue-100'
        }`}>
          From: {commentInfo.author}
        </div>
        {commentInfo.content && (
          <p className={`text-xs line-clamp-2 ${
            data.isDimmed ? 'text-gray-500' : 'text-blue-100'
          }`}>
            {commentInfo.content}
          </p>
        )}
      </div>
    </BaseNode>
  );
};

export default CommentNode; 