// Sample conversation data based on the Intercom conversation structure
export const sampleConversationData = {
  id: "215469380263515",
  assignee: {
    admin: { id: "6544102", name: "Femi" },
    team: { id: "6568051", name: "Gryffindor" }
  },
  initialSource: "conversation",
  startedOn: "2025-06-10 21:29:04",
  lastUpdated: "2025-06-10 21:29:35",
  state: "state_open",
  channel: "messenger",
  parts: [
    {
      id: "initial-part",
      createdAt: "2025-06-10 21:29:04 UTC",
      channel: "Conversation",
      author: "6848a35fcffe7fe36d7c1287",
      partType: "customer_initiated",
      content: "Initial customer message",
      details: {
        type: "customer_initiated",
        source: "messenger"
      }
    },
    {
      id: "24568048399",
      createdAt: "2025-06-10 21:29:05 UTC",
      channel: "unknown",
      author: "Operator",
      partType: "default_assignment",
      content: "Default assignment triggered",
      details: {
        assignee: {
          id: "6541654",
          label: "Dobby",
          type: "admin",
          assignee_is_operator: true
        },
        default_assignee: {
          label: "default assignee",
          type: "assignment_rules"
        },
        admin_assignee: {
          id: "6541654",
          label: "Dobby",
          type: "admin"
        }
      }
    },
    {
      id: "24568049100",
      createdAt: "2025-06-10 21:29:06 UTC",
      channel: "unknown",
      author: "Operator",
      partType: "language_detection",
      content: "Language detection details",
      details: {
        detected_language: "en",
        confidence: 0.95
      }
    },
    {
      id: "24568051745",
      createdAt: "2025-06-10 21:29:09 UTC",
      channel: "unknown",
      author: "Operator",
      partType: "default_assignment",
      content: "Secondary assignment",
      details: {
        assignee_type: "team",
        team_id: "6568051"
      }
    },
    {
      id: "24568061766",
      createdAt: "2025-06-10 21:29:21 UTC",
      channel: "messenger",
      author: "6544102",
      partType: "assignment",
      content: "Manual assignment by Femi",
      details: {
        assigned_to: "6544102",
        assigned_by: "system"
      }
    },
    {
      id: "24568070435",
      createdAt: "2025-06-10 21:29:32 UTC",
      channel: "messenger",
      author: "6848a35fcffe7fe36d7c1287",
      partType: "comment",
      content: "Customer response message",
      details: {
        message_type: "comment",
        user_type: "customer"
      }
    },
    {
      id: "24568072130",
      createdAt: "2025-06-10 21:29:34 UTC",
      channel: "unknown",
      author: "Operator",
      partType: "conversation_attribute_updated",
      content: "Conversation attribute updated by admin",
      details: {
        attribute: "priority",
        new_value: "high",
        updated_by: "admin"
      }
    }
  ]
}; 