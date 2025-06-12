import React from 'react';
import { Eye, EyeOff, Network, Table } from 'lucide-react';

const Navbar = ({ isBasicView, onToggleView, conversationData }) => {
  return (
    <div className="fixed top-0 left-80 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-6">
      {/* Left side - Conversation info */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Conversation Visualizer
          </h1>
          <p className="text-sm text-gray-500">
            ID: {conversationData?.id || 'Loading...'} • {conversationData?.parts?.length || 0} events
          </p>
        </div>
      </div>

      {/* Right side - View controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>View:</span>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onToggleView(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                !isBasicView
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Network className="w-4 h-4" />
              Detailed
            </button>
            <button
              onClick={() => onToggleView(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isBasicView
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Basic
            </button>
          </div>
        </div>

        {/* Additional controls */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 