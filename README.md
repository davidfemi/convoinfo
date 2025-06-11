# 🗺️ Conversation Path Visualizer

A visual interface for displaying conversation flows inspired by Tines' drag-and-drop story builder. Transform conversation events from platforms like Intercom into interactive node-based workflows that show the complete customer journey.

Built with **React**, **React Flow**, and **Tailwind CSS** for a modern, responsive experience.

![Conversation Visualizer](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-cyan) ![React Flow](https://img.shields.io/badge/React%20Flow-11.10.1-purple)

---

## ✨ Features

- 🎨 **Tines-inspired Design** - Clean, modern interface with professional styling
- 🧩 **Interactive Node Canvas** - Drag, zoom, and pan through conversation flows
- 📊 **Multiple Node Types** - Specialized components for assignments, comments, and system events
- 🔍 **Detailed Event Inspector** - Click any node to view comprehensive event information
- 📱 **Responsive Layout** - Works seamlessly on desktop and tablet devices
- 📤 **Import/Export** - Load your own conversation JSON data or export visualizations
- 🎯 **Event Timeline** - Visual representation of conversation chronology
- 🏷️ **Smart Categorization** - Automatic color coding and icons for different event types

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/conversation-visualizer.git
cd conversation-visualizer

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the application running.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📊 Node Types

### 🟣 Assignment Nodes
- **Default Assignment** - Automatic system assignments
- **Manual Assignment** - Human operator assignments
- Shows assignee details, admin information, and assignment rules

### 🔵 Comment Nodes  
- **Customer Messages** - Messages from end users
- **Agent Responses** - Support team communications
- Displays message content, channel, and sender information

### 🟢 System Nodes
- **Conversation Started** - Initial customer contact
- **Language Detection** - Automated language processing
- **Attribute Updates** - Conversation metadata changes
- Shows system actions, confidence scores, and processing details

---

## 📁 Project Structure

```
src/
├── components/
│   ├── NodeTypes/
│   │   ├── BaseNode.jsx          # Shared node component
│   │   ├── AssignmentNode.jsx    # Assignment event nodes
│   │   ├── CommentNode.jsx       # Message nodes
│   │   └── SystemNode.jsx        # System event nodes
│   ├── Sidebar/
│   │   └── DetailsSidebar.jsx    # Event details panel
│   └── FlowCanvas.jsx            # Main React Flow canvas
├── data/
│   └── sampleConversation.js     # Sample conversation data
├── App.jsx                       # Main application component
├── main.jsx                      # React entry point
└── index.css                     # Global styles & Tailwind
```

---

## 🔧 Data Format

The visualizer expects conversation data in this format:

```json
{
  "id": "215469380263515",
  "assignee": {
    "admin": { "id": "6544102", "name": "Femi" },
    "team": { "id": "6568051", "name": "Gryffindor" }
  },
  "state": "state_open",
  "channel": "messenger",
  "parts": [
    {
      "id": "unique-id",
      "createdAt": "2025-06-10 21:29:04 UTC",
      "channel": "messenger",
      "author": "author-id",
      "partType": "customer_initiated",
      "content": "Event description",
      "details": {
        "type": "customer_initiated",
        "source": "messenger"
      }
    }
  ]
}
```

### Supported Part Types:
- `customer_initiated` - Conversation start
- `default_assignment` - System assignment
- `assignment` - Manual assignment  
- `comment` - Messages/responses
- `language_detection` - Language processing
- `conversation_attribute_updated` - Metadata changes

---

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom Tines-inspired colors:
- `tines-blue`: #0066cc
- `tines-gray`: #f8f9fa  
- `tines-border`: #e1e5e9

### Node Colors
- 🟣 **Purple**: Assignment events
- 🔵 **Blue**: Customer interactions & language detection
- 🟢 **Green**: Conversation start & agent responses
- 🟠 **Orange**: Attribute updates
- ⚪ **Gray**: Other system events

### Adding New Node Types
1. Create a new component in `src/components/NodeTypes/`
2. Extend from `BaseNode` component
3. Register in `FlowCanvas.jsx` nodeTypes object
4. Add partType handling in data transformation

---

## 🔌 Integration

### Intercom Integration
Perfect for visualizing Intercom conversation data. The data structure matches Intercom's conversation parts API.

### Custom Platforms
Adapt the data transformation logic in `FlowCanvas.jsx` to support your platform's conversation format.

### API Integration
Replace the sample data with API calls to fetch real conversation data:

```javascript
const fetchConversationData = async (conversationId) => {
  const response = await fetch(`/api/conversations/${conversationId}`);
  return response.json();
};
```

---

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack
- **React 18** - UI framework
- **React Flow 11** - Interactive flow diagrams
- **Tailwind CSS 3** - Utility-first styling
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting
- **Vite** - Fast build tool

---

## 📈 Roadmap

### Planned Features
- 🔍 **Advanced Filtering** - Filter by event type, date range, or participants
- 📊 **Analytics Dashboard** - Conversation metrics and insights  
- 🏷️ **Manual Annotations** - Add notes and highlights to flows
- 🔗 **Deep Linking** - Share specific conversation states
- 📱 **Mobile Optimization** - Enhanced mobile experience
- 🎨 **Theme Customization** - Dark mode and custom color schemes
- 📦 **Export Options** - PNG, PDF, and shareable link exports

### Integration Targets
- Zendesk conversations
- Slack thread visualization
- Microsoft Teams chat flows
- Custom webhook support

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙋‍♂️ Support

- 📧 **Issues**: Create an issue on GitHub
- 📖 **Documentation**: Check the wiki for detailed guides
- 💬 **Discussions**: Join community discussions

Built with ❤️ for better conversation analysis and customer support insights.

