# NFL Field Visualization Data Format Guide

This guide explains how to structure data for the NFL field visualization system.

## Overview

The visualization system uses a JSON format to represent NFL plays with player positions, movements, and game context. The data includes team information, player details, and frame-by-frame position data.

## Data Structure

### Root Object

```typescript
{
  "teams": Team[],
  "players": Player[],
  "summary_of_play": string,
  "plays": PlayFrame[]
}
```

### Team Object

```typescript
{
  "team_id": string,      // Abbreviation (e.g., "KC", "PHI")
  "name": string,         // Full team name
  "side": "offense" | "defense"
}
```

### Player Object

```typescript
{
  "id": number,          // Unique player ID
  "team": string,        // Team abbreviation matching team_id
  "name": string,        // Player full name
  "position": string     // Position code (QB, RB, WR, TE, etc.)
}
```

### PlayFrame Object

```typescript
{
  "time": number,                    // Time in seconds
  "description": string,             // What happens at this moment
  "summary": {                       // Optional team-specific summaries
    "offense_kc": string,
    "defense_phi": string
  },
  "ball": { "x": number, "z": number },
  "positions": {                     // Player positions
    "[player_id]": [x, z]           // [x-coordinate, z-coordinate]
  },
  "open_space_offense": {           // Optional: Distance to nearest defender
    "[player_id]": number
  },
  "open_space_defense": {           // Optional: Distance to nearest offensive player
    "[player_id]": number
  }
}
```

## Coordinate System

The field uses a coordinate system where:
- **X-axis**: Runs across the field width (-26.7 to +26.7 yards)
  - Negative X: Left side (when facing the offense's goal)
  - Positive X: Right side
  - 0: Center of field

- **Z-axis**: Runs along the field length (-10 to 110 yards)
  - -10 to 0: Behind the goal line (end zone)
  - 0: Goal line
  - 50: Midfield
  - 100: Opposite goal line
  - 100 to 110: Opposite end zone

### Important Notes:
- The visualization automatically swaps X and Z coordinates for rendering
- In the data file: Use standard football coordinates
- In Three.js rendering: position = [z, 0, x] (coordinates are swapped)

## Example Data

```json
{
  "teams": [
    { "team_id": "KC", "name": "Kansas City Chiefs", "side": "offense" },
    { "team_id": "PHI", "name": "Philadelphia Eagles", "side": "defense" }
  ],
  
  "summary_of_play": "KC in shotgun; Mahomes scrambles and throws to Brown. Ball deflects, DeJean intercepts.",
  
  "players": [
    { "id": 1, "team": "KC", "name": "Patrick Mahomes", "position": "QB" },
    { "id": 2, "team": "KC", "name": "Travis Kelce", "position": "TE" },
    { "id": 26, "team": "PHI", "name": "Cooper DeJean", "position": "CB" }
  ],
  
  "plays": [
    {
      "time": 0.0,
      "description": "Snap from shotgun formation",
      "ball": { "x": 0, "z": 28 },
      "positions": {
        "1": [0, 28],      // Mahomes at QB position
        "2": [5, 30],      // Kelce to the right
        "26": [-8, 35]     // DeJean in coverage
      }
    },
    {
      "time": 1.5,
      "description": "Mahomes scrambles right",
      "ball": { "x": 3, "z": 25 },
      "positions": {
        "1": [3, 25],
        "2": [7, 38],
        "26": [-6, 37]
      },
      "open_space_offense": {
        "2": 5.2          // Kelce has 5.2 yards of separation
      }
    }
  ]
}
```

## Position Guidelines

### Common Starting Positions (Offense)
- **QB in Shotgun**: [0, 25] to [0, 30]
- **RB**: [-3, 27] to [3, 27]
- **WR (Wide)**: [-20, 30] to [-26, 30] (left), [20, 30] to [26, 30] (right)
- **WR (Slot)**: [-10, 30] to [-15, 30] (left), [10, 30] to [15, 30] (right)
- **TE**: [-5, 30] to [-8, 30] (left), [5, 30] to [8, 30] (right)

### Common Starting Positions (Defense)
- **CB**: Match WR positions, typically 5-10 yards deeper
- **Safety**: [±10, 45] to [±15, 50]
- **LB**: [±5, 35] to [±10, 40]
- **DL**: Along line of scrimmage (~30-32 yard line)

## Open Space Calculation

The `open_space_offense` and `open_space_defense` fields represent the distance (in yards) to the nearest opposing player. This is used to visualize:
- How open receivers are
- Defensive coverage quality
- Running lanes

Only include for eligible receivers (WR, TE, RB) and key defenders.

## Animation Timing

- Frame times should be in seconds with decimal precision
- Typical play duration: 3-8 seconds
- Recommended frame rate: 2-4 frames per second for smooth animation
- Key moments (snap, throw, catch, tackle) should have explicit frames

## Best Practices

1. **Consistent Player IDs**: Use the same ID throughout all frames
2. **Smooth Transitions**: Ensure player movements between frames are realistic
3. **Ball Tracking**: Update ball position for passes, handoffs, and fumbles
4. **Descriptions**: Make descriptions concise but informative
5. **Time Precision**: Use consistent decimal places (typically 1 decimal)

## Validation Checklist

- [ ] All player IDs in positions match defined players
- [ ] All team abbreviations match team definitions
- [ ] Positions are within field bounds (-26.7 ≤ x ≤ 26.7, -10 ≤ z ≤ 110)
- [ ] Frame times are sequential and increasing
- [ ] Ball position is updated appropriately
- [ ] Required fields are present in each object

## Converting from Other Formats

If converting from tracking data:
1. Map player tracking IDs to consistent numbering
2. Convert coordinates to yards if in meters (multiply by 1.09361)
3. Normalize coordinates to field-relative positions
4. Sample at appropriate intervals (0.25-0.5 second intervals)
5. Add contextual descriptions for key moments

## Testing Your Data

1. Verify JSON validity using a JSON validator
2. Check coordinate bounds
3. Ensure smooth animation by reviewing position changes
4. Test with a single frame first, then expand
5. Verify player counts match between teams and players arrays