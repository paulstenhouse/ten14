# Threads Data Format Guide

This document describes the JSON structure for threads (conversations), messages, and associated simulation data in the SportsGPT application.

## Overview

The system uses a hierarchical structure where:
- **Threads** are conversations between users and the AI
- **Messages** belong to threads and represent individual exchanges
- **Simulations** are referenced by messages and contain the actual play data

## Data Structure

### Thread Object

```typescript
interface Thread {
  id: string;                    // UUID v4 format
  title: string;                 // Display title for the thread
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp
  lastMessageAt?: string;       // ISO 8601 timestamp of last message
  metadata?: {
    tags?: string[];            // Optional tags for categorization
    sport?: string;             // Sport type (e.g., "nfl", "nba")
    teams?: string[];           // Team abbreviations involved
  };
}
```

### Message Object

```typescript
interface Message {
  id: string;                    // UUID v4 format
  threadId: string;              // Reference to parent thread
  role: 'user' | 'assistant';   // Who sent the message
  content: string;               // Message text content
  timestamp: string;             // ISO 8601 timestamp
  
  // Optional simulation reference
  simulation?: {
    id: string;                  // Simulation ID
    type: 'play' | 'game' | 'season';
    displayTitle?: string;       // Override title for the simulation card
    thumbnail?: string;          // URL to thumbnail image
  };
  
  // Optional metadata
  metadata?: {
    edited?: boolean;            // If message was edited
    editedAt?: string;          // When it was edited
    tokens?: number;            // Token count for the message
  };
}
```

### Simulation Data Object

```typescript
interface SimulationData {
  id: string;                    // UUID v4 format
  type: 'play' | 'game' | 'season';
  sport: string;                 // Sport type
  
  // Basic information
  title: string;                 // e.g., "DeJean INT Return - 70 yards"
  description: string;           // Detailed description
  date: string;                  // ISO 8601 timestamp of when it occurred
  
  // Teams involved
  teams: {
    home: {
      id: string;                // Team abbreviation (e.g., "KC")
      name: string;              // Full name (e.g., "Kansas City Chiefs")
      score?: number;            // Score at this point
    };
    away: {
      id: string;
      name: string;
      score?: number;
    };
  };
  
  // Play-specific data (for type='play')
  playData?: {
    quarter: number;
    time: string;                // Game clock (e.g., "14:32")
    down?: number;               // 1-4
    distance?: number;           // Yards to go
    yardLine?: number;           // Field position
    playType: string;            // e.g., "pass", "run", "interception"
    result: string;              // e.g., "Interception returned for 70 yards"
    
    // Animation frames
    frames: AnimationFrame[];    // See existing DATA_FORMAT.md
    
    // Player tracking
    players: {
      offense: Player[];
      defense: Player[];
    };
  };
  
  // Statistics
  stats?: {
    [key: string]: any;          // Flexible stats based on play type
  };
}
```

## Example Data

### Complete Thread with Messages and Simulation

```json
{
  "thread": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "DeJean Interception Analysis",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:45:00Z",
    "lastMessageAt": "2024-01-15T10:45:00Z",
    "metadata": {
      "tags": ["interception", "eagles", "chiefs"],
      "sport": "nfl",
      "teams": ["PHI", "KC"]
    }
  },
  
  "messages": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "threadId": "550e8400-e29b-41d4-a716-446655440001",
      "role": "user",
      "content": "Show me the DeJean interception from the Chiefs game",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "threadId": "550e8400-e29b-41d4-a716-446655440001",
      "role": "assistant",
      "content": "I'll show you Cooper DeJean's incredible 70-yard interception return against the Chiefs. This was a pivotal moment in the game where DeJean read Mahomes perfectly and jumped the route.",
      "timestamp": "2024-01-15T10:30:05Z",
      "simulation": {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "type": "play",
        "displayTitle": "DeJean INT Return - 70 yards"
      }
    }
  ],
  
  "simulation": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "type": "play",
    "sport": "nfl",
    "title": "DeJean INT Return - 70 yards",
    "description": "Cooper DeJean intercepts Patrick Mahomes' pass intended for Marquise Brown and returns it 70 yards",
    "date": "2024-01-14T20:15:00Z",
    
    "teams": {
      "home": {
        "id": "PHI",
        "name": "Philadelphia Eagles",
        "score": 21
      },
      "away": {
        "id": "KC",
        "name": "Kansas City Chiefs",
        "score": 17
      }
    },
    
    "playData": {
      "quarter": 3,
      "time": "8:42",
      "down": 2,
      "distance": 8,
      "yardLine": 72,
      "playType": "interception",
      "result": "Interception returned for 70 yards to KC 12",
      
      "frames": [
        // See DATA_FORMAT.md for frame structure
      ],
      
      "players": {
        "offense": [
          {
            "id": 1,
            "name": "Patrick Mahomes",
            "position": "QB",
            "number": "15"
          }
          // ... more players
        ],
        "defense": [
          {
            "id": 26,
            "name": "Cooper DeJean",
            "position": "CB",
            "number": "33"
          }
          // ... more players
        ]
      }
    },
    
    "stats": {
      "interceptionYards": 70,
      "timeOfPossessionChange": "8:42",
      "fieldPositionChange": 58,
      "winProbabilityChange": 0.15
    }
  }
}
```

## API Endpoints (Proposed)

```
GET    /api/threads                    # List all threads
GET    /api/threads/:id                # Get thread with messages
POST   /api/threads                    # Create new thread
PUT    /api/threads/:id                # Update thread
DELETE /api/threads/:id                # Delete thread

GET    /api/threads/:id/messages       # Get messages for thread
POST   /api/threads/:id/messages       # Add message to thread
PUT    /api/messages/:id               # Update message
DELETE /api/messages/:id               # Delete message

GET    /api/simulations/:id            # Get simulation data
GET    /api/simulations/:id/frames     # Get animation frames
```

## Storage Considerations

1. **Threads and Messages**: Store in primary database (PostgreSQL/MySQL)
2. **Simulation Data**: Can be stored separately in:
   - Document store (MongoDB) for flexibility
   - Object storage (S3) for large frame data
   - Cache layer (Redis) for frequently accessed simulations

3. **Relationships**:
   - Messages reference threads via `threadId`
   - Messages optionally reference simulations via `simulation.id`
   - Simulations are independent and can be referenced by multiple messages

## Migration from Current Structure

Current `Conversation` type maps to `Thread`:
```typescript
// Current
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// New Thread (messages stored separately)
interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  metadata?: ThreadMetadata;
}
```

## Benefits of This Structure

1. **Scalability**: Messages stored separately from threads
2. **Reusability**: Simulations can be referenced by multiple messages
3. **Flexibility**: Metadata fields allow for future expansion
4. **Performance**: Can lazy-load messages and simulations
5. **Analytics**: Easier to track usage patterns and popular content