import React, { useState } from 'react';
import { MessageSquare, Upload, Download, Settings } from 'lucide-react';
import FlowCanvas from './components/FlowCanvas';
import { sampleConversation } from './data/sampleConversation';

function App() {
  const [conversationData, setConversationData] = useState(sampleConversation);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setConversationData(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file. Please check the format.');
        }
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const exportFlow = () => {
    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `conversation-${conversationData.id || 'export'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tines-blue rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Conversation Visualizer
              </h1>
              <p className="text-sm text-gray-500">
                Interactive conversation flow analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Conversation Info */}
            {conversationData && (
              <div className="hidden md:flex items-center gap-4 mr-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono text-gray-900">
                    {conversationData.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Events:</span>
                  <span className="font-semibold text-gray-900">
                    {conversationData.parts?.length || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    conversationData.state === 'state_open' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-900 capitalize">
                    {conversationData.state?.replace('state_', '') || 'Unknown'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={exportFlow}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tines-blue"></div>
              <span className="text-gray-900 font-medium">Loading conversation...</span>
            </div>
          </div>
        ) : (
          <FlowCanvas conversationData={conversationData} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>🗺️ Conversation Path Visualizer</span>
            <span>•</span>
            <span>Drag nodes to rearrange • Click for details</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Powered by React Flow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 