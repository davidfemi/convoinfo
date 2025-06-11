import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Bot, Database, BarChart3, 
  Bug, Flag, AlertTriangle, ExternalLink, Activity,
  Zap, MessageSquare
} from 'lucide-react';

const LeftSidebar = ({ conversationData }) => {
  const [expandedSections, setExpandedSections] = useState({
    automation: true,
    conversationData: false,
    conversationStats: false,
    debugLogs: false,
    flags: false,
    extremeMeasures: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleSection = ({ id, title, icon: SectionIcon, children, badge = null }) => {
    const isExpanded = expandedSections[id];
    const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SectionIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">{title}</h3>
            {badge && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <ChevronIcon className="w-4 h-4 text-gray-400" />
        </button>
        {isExpanded && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const LogLink = ({ platform, url, description }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div>
        <div className="font-medium text-gray-900">{platform}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400" />
    </a>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl border-r border-gray-200 z-40 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Operations Center</h1>
            <p className="text-sm text-gray-500">Conversation #{conversationData?.id || 'Loading...'}</p>
          </div>
        </div>
      </div>

      {/* Operational Sections */}
      <div className="divide-y divide-gray-200">
        {/* Automation Section */}
        <CollapsibleSection
          id="automation"
          title="Automation"
          icon={Bot}
          badge="2 active"
        >
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Auto-Assignment Rule</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-green-700">Triggered assignment based on keyword detection</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Language Detection</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Completed</span>
              </div>
              <p className="text-sm text-blue-700">Automatically detected language: English (95% confidence)</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Conversation Data Section */}
        <CollapsibleSection
          id="conversationData"
          title="Conversation Data"
          icon={Database}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Conversation ID</div>
                <div className="font-mono text-xs">{conversationData?.id || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">State</div>
                <div className="text-xs font-medium text-green-600">
                  {conversationData?.state?.replace('state_', '') || 'Unknown'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Channel</div>
                <div className="text-xs">{conversationData?.channel || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Events</div>
                <div className="text-xs font-medium text-blue-600">
                  {conversationData?.parts?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Conversation Stats Section */}
        <CollapsibleSection
          id="conversationStats"
          title="Conversation Stats"
          icon={BarChart3}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Response Time</div>
                <div className="text-lg font-semibold text-green-600">2.3s</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Messages</div>
                <div className="text-lg font-semibold text-blue-600">
                  {conversationData?.parts?.filter(p => p.partType === 'comment').length || 0}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Sentiment</div>
                <div className="text-lg font-semibold text-yellow-600">Neutral</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Assignments</div>
                <div className="text-lg font-semibold text-purple-600">
                  {conversationData?.parts?.filter(p => p.partType.includes('assignment')).length || 0}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Debug & Logs Section */}
        <CollapsibleSection
          id="debugLogs"
          title="Debug & Logs"
          icon={Bug}
        >
          <div className="space-y-3">
            <LogLink
              platform="Kibana Logs"
              url={`https://kibana.company.com/app/discover#/?_g=(filters:!(),query:(query:'conversation_id:${conversationData?.id}',language:kuery))`}
              description="View detailed application logs"
            />
            <LogLink
              platform="Snowflake Logs"
              url={`https://app.snowflake.com/dashboard?query=conversation_id:${conversationData?.id}`}
              description="Database query logs and metrics"
            />
            <LogLink
              platform="Elasticsearch Ingestion"
              url={`https://elastic.company.com/app/discover#/?query=conversation_id:${conversationData?.id}`}
              description="Data pipeline and indexing status"
            />
          </div>
        </CollapsibleSection>

        {/* Flags Section */}
        <CollapsibleSection
          id="flags"
          title="Flags"
          icon={Flag}
          badge="1 active"
        >
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">High Priority</span>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-yellow-700">Conversation marked as high priority due to customer tier</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">No other flags currently active</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Extreme Measures Section */}
        <CollapsibleSection
          id="extremeMeasures"
          title="Extreme Measures"
          icon={AlertTriangle}
        >
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm font-medium text-red-900 mb-2">Emergency Actions</div>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-red-700 hover:text-red-900 p-2 hover:bg-red-100 rounded transition-colors">
                  🚨 Escalate to Management
                </button>
                <button className="w-full text-left text-sm text-red-700 hover:text-red-900 p-2 hover:bg-red-100 rounded transition-colors">
                  ⏸️ Pause All Automation
                </button>
                <button className="w-full text-left text-sm text-red-700 hover:text-red-900 p-2 hover:bg-red-100 rounded transition-colors">
                  🔄 Force Workflow Restart
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default LeftSidebar; 