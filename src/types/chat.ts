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
    tokens?: number            // Token count for the message
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