export interface Thread {
  id: string                    // UUID v4 format
  title: string                 // Display title for the thread
  createdAt: string            // ISO 8601 timestamp
  updatedAt: string            // ISO 8601 timestamp
  lastMessageAt?: string       // ISO 8601 timestamp of last message
  metadata?: {
    tags?: string[]            // Optional tags for categorization
    sport?: string             // Sport type (e.g., "nfl", "nba")
    teams?: string[]           // Team abbreviations involved
  }
  stats?: {
    totalTokens?: number       // Total tokens used in this thread
    totalCost?: number         // Total cost in dollars
    messageCount?: number      // Number of messages
    modelBreakdown?: {         // Token usage by model
      [model: string]: {
        tokens: number
        cost: number
      }
    }
  }
}

export interface AgentMetadata {
  tokens: number               // Tokens used by this agent
  reasoning: string           // Agent's internal reasoning/thinking
  cost?: number              // Cost in dollars for this agent call
  model?: string             // Model used (e.g., "gpt-4", "claude-3")
  duration?: number          // Time taken in milliseconds
}

export interface Message {
  id: string                    // UUID v4 format
  threadId: string              // Reference to parent thread
  role: 'user' | 'assistant'   // Who sent the message
  content: string               // Message text content
  timestamp: string             // ISO 8601 timestamp
  
  // Optional simulation reference
  simulation?: {
    id: string                  // Simulation ID
    type: 'play' | 'game' | 'season'
    displayTitle?: string       // Override title for the simulation card
    thumbnail?: string          // URL to thumbnail image
  }
  
  // Optional metadata
  metadata?: {
    edited?: boolean            // If message was edited
    editedAt?: string          // When it was edited
    
    // Token usage (similar to OpenAI/Anthropic)
    usage?: {
      promptTokens?: number    // Input/prompt tokens
      completionTokens?: number // Output/completion tokens
      totalTokens?: number     // Total tokens (prompt + completion)
      cacheCreationTokens?: number // Tokens used to create cache (if applicable)
      cacheReadTokens?: number // Tokens read from cache (if applicable)
    }
    
    // Performance metrics
    duration?: number          // Total response time in milliseconds
    firstTokenLatency?: number // Time to first token (streaming)
    tokensPerSecond?: number   // Generation speed
    
    // Model information
    model?: string             // Model used (e.g., "gpt-4", "claude-3-sonnet")
    temperature?: number       // Temperature setting used
    maxTokens?: number         // Max tokens limit for this request
    
    // Response metadata
    stopReason?: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use'
    finishReason?: string      // Why the response ended
    
    // Agent/reasoning data
    agents?: AgentMetadata[]   // Array of agent calls with reasoning
    
    // Cost tracking
    estimatedCost?: number     // Estimated cost in dollars
    
    // Additional flags
    cached?: boolean           // Whether response was cached
    truncated?: boolean        // Whether response was truncated
  }
}

// Legacy Conversation type for backwards compatibility during migration
export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}