import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Bot, Database, BarChart3, 
  Bug, Flag, AlertTriangle, ExternalLink, Activity,
  Zap, MessageSquare, Filter, Eye, EyeOff, Users,
  Settings, Globe, Tag
} from 'lucide-react';

const LeftSidebar = ({ conversationData, selectedCategory, onCategoryChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    categoryFilter: true,
    automation: false,
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

  // Category definitions with colors and counts
  const getCategories = () => {
    const parts = conversationData?.parts || [];
    const workflows = conversationData?.workflows || [];
    
    return [
      {
        id: 'all',
        name: 'All Events',
        icon: Eye,
        color: 'gray',
        count: parts.length + workflows.length,
        description: 'Show all conversation events'
      },
      {
        id: 'assignments',
        name: 'Assignments',
        icon: Users,
        color: 'purple',
        count: parts.filter(p => ['default_assignment', 'assignment'].includes(p.partType)).length,
        description: 'Manual and automatic assignments'
      },
      {
        id: 'comments',
        name: 'Messages',
        icon: MessageSquare,
        color: 'blue',
        count: parts.filter(p => p.partType === 'comment').length,
        description: 'Customer and agent communications'
      },
      {
        id: 'workflows',
        name: 'Workflows',
        icon: Bot,
        color: 'purple',
        count: workflows.length,
        description: 'Automated workflow executions'
      },
      {
        id: 'system',
        name: 'System Events',
        icon: Settings,
        color: 'teal',
        count: parts.filter(p => !['default_assignment', 'assignment', 'comment'].includes(p.partType)).length,
        description: 'Automated system actions'
      }
    ];
  };

  const categories = getCategories();

  const CategoryButton = ({ category }) => {
    const isActive = selectedCategory === category.id;
    const Icon = category.icon;
    
    return (
      <button
        onClick={() => onCategoryChange(category.id)}
        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
          isActive 
            ? `border-${category.color}-500 bg-${category.color}-50` 
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isActive 
                ? `bg-${category.color}-100` 
                : 'bg-gray-100'
            }`}>
              <Icon className={`w-4 h-4 ${
                isActive 
                  ? `text-${category.color}-600` 
                  : 'text-gray-600'
              }`} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-medium ${
                isActive 
                  ? `text-${category.color}-900` 
                  : 'text-gray-900'
              }`}>
                {category.name}
              </div>
              <div className="text-xs text-gray-500">
                {category.description}
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? `bg-${category.color}-100 text-${category.color}-700` 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {category.count}
          </div>
        </div>
      </button>
    );
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
        {/* Category Filter Section */}
        <CollapsibleSection
          id="categoryFilter"
          title="Focus & Filter"
          icon={Filter}
          badge={selectedCategory !== 'all' ? 'filtered' : null}
        >
          <div className="space-y-3">
            <div className="text-xs text-gray-500 mb-3">
              Click a category to highlight those events and dim others
            </div>
            {categories.map((category) => (
              <CategoryButton key={category.id} category={category} />
            ))}
            {selectedCategory !== 'all' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">
                    Filtering: {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                </div>
                <button 
                  onClick={() => onCategoryChange('all')}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Automation Section */}
        <CollapsibleSection
          id="automation"
          title="Automation"
          icon={Bot}
          badge={conversationData?.workflows?.length ? `${conversationData.workflows.length} workflows` : "2 active"}
        >
          <div className="space-y-3">
            {/* Show real workflow data if available */}
            {conversationData?.workflows?.map((workflow) => (
              <div key={workflow.id} className={`border rounded-lg p-3 ${
                workflow.state === 'completed' ? 'bg-green-50 border-green-200' :
                workflow.state === 'running' ? 'bg-blue-50 border-blue-200' :
                workflow.state === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-4 h-4 ${
                    workflow.state === 'completed' ? 'text-green-600' :
                    workflow.state === 'running' ? 'text-blue-600' :
                    workflow.state === 'failed' ? 'text-red-600' :
                    'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    workflow.state === 'completed' ? 'text-green-900' :
                    workflow.state === 'running' ? 'text-blue-900' :
                    workflow.state === 'failed' ? 'text-red-900' :
                    'text-gray-900'
                  }`}>
                    {workflow.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    workflow.state === 'completed' ? 'bg-green-100 text-green-700' :
                    workflow.state === 'running' ? 'bg-blue-100 text-blue-700' :
                    workflow.state === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {workflow.state}
                  </span>
                </div>
                <p className={`text-sm ${
                  workflow.state === 'completed' ? 'text-green-700' :
                  workflow.state === 'running' ? 'text-blue-700' :
                  workflow.state === 'failed' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  ID: {workflow.id} • {workflow.related_parts?.length || 0} related parts
                </p>
                {workflow.entity && (
                  <p className={`text-xs mt-1 ${
                    workflow.state === 'completed' ? 'text-green-600' :
                    workflow.state === 'running' ? 'text-blue-600' :
                    workflow.state === 'failed' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    Entity: {workflow.entity}
                  </p>
                )}
              </div>
            )) || (
              // Fallback to default automation examples if no workflow data
              <>
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
              </>
            )}
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