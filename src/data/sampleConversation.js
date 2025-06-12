// Sample conversation data with workflow automation examples
export const sampleConversation = {
  id: "21903209600",
  state: "state_open",
  channel: "messenger",
  parts: [
    {
      id: "initial_part",
      partType: "customer_initiated",
      createdAt: "2025-02-17T19:16:44.000Z",
      author: "Dobby (6541654)",
      channel: "messenger",
      content: "Customer started the conversation",
      details: {
        source: "messenger",
        customer_id: "6541654"
      }
    },
    {
      id: "21903209653",
      partType: "conversation_attribute_updated",
      createdAt: "2025-02-17T19:16:45.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Conversation attribute updated by admin",
      details: {
        attribute: "priority",
        new_value: "high",
        updated_by: "admin"
      }
    },
    {
      id: "21903209654",
      partType: "conversation_attribute_updated",
      createdAt: "2025-02-17T19:16:45.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Conversation attribute updated by admin",
      details: {
        attribute: "department",
        new_value: "support",
        updated_by: "admin"
      }
    },
    {
      id: "21903209655",
      partType: "default_assignment",
      createdAt: "2025-02-17T19:16:46.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Default assignment triggered",
      details: {
        assignee: {
          label: "Support Team",
          type: "team"
        },
        rule_triggered: "priority_based_assignment"
      }
    },
    {
      id: "21903209656",
      partType: "language_detection",
      createdAt: "2025-02-17T19:16:46.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Language detection completed",
      details: {
        detected_language: "en",
        confidence: 0.95
      }
    },
    {
      id: "21903209657",
      partType: "comment",
      createdAt: "2025-02-17T19:16:47.000Z",
      author: "64d970d5d3171bc3294d2948",
      channel: "messenger",
      content: "Hello! How can I help you today?",
      details: {
        author: {
          label: "Agent Sarah",
          type: "agent"
        },
        content: "Hello! How can I help you today?"
      }
    },
    {
      id: "21903209658",
      partType: "custom_action_started",
      createdAt: "2025-02-17T19:16:50.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Custom action started - Get order details",
      details: {
        workflow_id: "646439340",
        workflow_name: "Fin Profile",
        action_type: "data_connector",
        action_name: "get_order_details",
        triggered_by: "fin_ai_agent",
        related_parts: ["21903209657"]
      }
    },
    {
      id: "21903209659",
      partType: "custom_action_finished",
      createdAt: "2025-02-17T19:16:55.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Custom action completed successfully",
      details: {
        workflow_id: "646439340",
        workflow_name: "Fin Profile",
        action_type: "data_connector",
        action_name: "get_order_details",
        status: "success",
        result: "Order details retrieved successfully",
        related_parts: ["21903209657", "21903209662"]
      }
    },
    {
      id: "21903209660",
      partType: "custom_action_started",
      createdAt: "2025-02-17T19:16:54.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Available Fin actions triggered",
      details: {
        workflow_id: "646439340",
        workflow_name: "Fin Profile",
        action_type: "available_actions",
        triggered_by: "workflow"
      }
    },
    {
      id: "21903209661",
      partType: "custom_action_finished",
      createdAt: "2025-02-17T19:16:55.000Z",
      author: "Operator 🤖",
      channel: "unknown",
      content: "Custom action finished - Available actions processed",
      details: {
        workflow_id: "646439340",
        workflow_name: "Fin Profile",
        action_type: "available_actions",
        status: "completed"
      }
    },
    {
      id: "21903209662",
      partType: "comment",
      createdAt: "2025-02-17T19:17:29.000Z",
      author: "Operator 🤖 (AI generated)",
      channel: "messenger",
      content: "I can help you with your order. Let me get the details for you.",
      details: {
        author: {
          label: "Fin AI Agent",
          type: "ai_agent"
        },
        content: "I can help you with your order. Let me get the details for you.",
        generated_by: "fin_ai_agent",
        workflow_triggered: "646439340"
      }
    },
    {
      id: "21903209663",
      partType: "comment",
      createdAt: "2025-02-17T19:17:29.000Z",
      author: "Operator 🤖 (AI generated)",
      channel: "messenger",
      content: "Based on your account, I can see your recent orders and help you track them.",
      details: {
        author: {
          label: "Fin AI Agent",
          type: "ai_agent"
        },
        content: "Based on your account, I can see your recent orders and help you track them.",
        generated_by: "fin_ai_agent"
      }
    }
  ],
  // Workflow execution data
  workflows: [
    {
      id: "646439340",
      name: "Fin Profile",
      state: "completed",
      started_at: "2025-02-17T19:16:48.000Z",
      finished_at: "2025-02-17T19:16:56.000Z",
      entity: "Demo Profile (entity_id: 2327831)",
      workflow_instance: "id: a5c0001, snapshot_id: 3b02607, snapshot_is_most_recent: true",
      executed_controls: [
        {
          step: "Path Title: Untitled",
          step_runner: "Answer bot",
          status: "PASSED",
          full_json: true
        }
      ],
      related_parts: [
        "21903209658", // custom_action_started
        "21903209659", // custom_action_finished  
        "21903209660", // custom_action_started
        "21903209661", // custom_action_finished
        "21903209662", // AI generated comment
        "21903209663"  // AI generated comment
      ],
      automation_settings: {
        source: "behavior_version",
        id: "2327831",
        bot_mode: "bot_only",
        use_ai_answers: true,
        use_custom_answers: true,
        has_custom_inactivity_settings: true,
        end_user_inactivity_timer: "180",
        user_inactivity_mode_when_no_answer: null,
        user_inactivity_mode_when_answer: null,
        user_inactivity_mode_when_no_question: null,
        cost_enabled: false,
        cost_enabled_for_hard_resolution: false,
        cost_enabled_for_soft_resolution: false,
        cost_block_update_after: null,
        pre_handover_answer_enabled: false,
        follow_up_type: null,
        hard_resolution_workflow: null,
        inactivity_workflow: null,
        theme_based_rollout_enabled: false,
        user_inactivity_auto_close_messages: null,
        confirm_resolution_enabled: null
      },
      personality_settings: {
        ai_tone_of_voice: "friendly",
        ai_language_style: "informal",
        ai_answer_length: "standard"
      }
    }
  ]
}; 