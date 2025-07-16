// New cleaner play data format
export interface Team {
  team_id: string
  name: string
  side: 'offense' | 'defense'
}

export interface Player {
  id: number
  team: string
  name: string
  position: string
}

export interface PlayFrame {
  time: number
  description?: string
  summary?: {
    offense_kc?: string
    defense_phi?: string
  }
  ball: { x: number; z: number }
  open_space_offense?: { [playerId: string]: number }
  open_space_defense?: { [playerId: string]: number }
  positions: { [playerId: string]: [number, number] }
  note?: string
}

export interface PlaySequence {
  teams: Team[]
  players: Player[]
  summary_of_play?: string
  plays: PlayFrame[]
}

// DeJean interception play data in new format
const deJeanInterceptionPlayRaw: PlaySequence = {
  "teams": [
    { "team_id": "KC",  "name": "Kansas City Chiefs",   "side": "offense" },
    { "team_id": "PHI", "name": "Philadelphia Eagles", "side": "defense" }
  ],
  
  "summary_of_play": "KC in shotgun; Mahomes scans right, scrambles, and fires a high dig toward Hollywood Brown. Ball tips off Brown's hands; CB Cooper DeJean undercuts, grabs the deflection at the PHI 10-m mark (≈ 4.7 s) and reverses field — a red-zone interception.",

  "players": [
    { "id": 1,  "team": "KC",  "name": "Patrick Mahomes",    "position": "QB" },
    { "id": 2,  "team": "KC",  "name": "Samaje Perine",      "position": "RB" },
    { "id": 3,  "team": "KC",  "name": "Xavier Worthy",      "position": "WR" },
    { "id": 4,  "team": "KC",  "name": "Hollywood Brown",    "position": "WR" },
    { "id": 5,  "team": "KC",  "name": "DeAndre Hopkins",    "position": "WR" },
    { "id": 6,  "team": "KC",  "name": "Noah Gray",          "position": "TE" },

    { "id": 26, "team": "PHI", "name": "Darius Slay",        "position": "CB" },
    { "id": 27, "team": "PHI", "name": "C.J. Gardner-Johnson","position": "S" },
    { "id": 28, "team": "PHI", "name": "Reed Blankenship",   "position": "S" },
    { "id": 29, "team": "PHI", "name": "Quinyon Mitchell",   "position": "CB" },
    { "id": 30, "team": "PHI", "name": "Cooper DeJean",      "position": "CB" },
    { "id": 31, "team": "PHI", "name": "Zack Baun",          "position": "LB" },
    { "id": 32, "team": "PHI", "name": "Oren Burks",         "position": "LB" },
    { "id": 33, "team": "PHI", "name": "Pass-Rush 1",        "position": "DL" },
    { "id": 34, "team": "PHI", "name": "Pass-Rush 2",        "position": "DL" }
  ],

  "plays": [
    {
      "time": 0.0,
      "description": "Pre-snap alignment – KC in shotgun, Eagles in two-high nickel.",
      "summary": {
        "offense_kc": "Mahomes in pocket; Perine offset left; three WR wide; Gray in-line right.",
        "defense_phi": "CBs Press at 10–16 m; two safeties 11 m deep; LBs at ~20 m."
      },
      "ball": { "x": -0.79, "z": 24.68 },
      "positions": {
        "1":  [ -0.90, 28.42 ],  "2":  [  1.82, 28.17 ],
        "3":  [-10.22, 26.16 ],  "4":  [ -8.57, 25.03 ],
        "5":  [  7.81, 25.05 ],  "6":  [ -6.17, 25.80 ],
        "26": [-13.24, 13.41 ],  "27": [ -5.66, 11.95 ],
        "28": [  3.50, 11.45 ],  "29": [  9.90, 16.27 ],
        "30": [ -9.28, 21.24 ],  "31": [ -5.04, 20.20 ],
        "32": [  2.08, 19.55 ],  "33": [ -3.79, 24.68 ],
        "34": [  2.21, 24.68 ]
      }
    },

    {
      "time": 0.4,
      "description": "Snap + QB drop – receivers begin routes, secondary opens hips.",
      "summary": {
        "offense_kc": "Mahomes 3-step drop; Brown/Worthy release outside; Hopkins stems inside.",
        "defense_phi": "DeJean pedals to 21 m, Slay bails to 13 m; LBs hold curl zone."
      },
      "ball": { "x": -0.79, "z": 24.68 },
      "positions": {
        "1":[ -0.887, 28.454 ], "2":[ 1.746, 28.291 ], "3":[-10.510,26.248],
        "4":[ -8.611,24.996 ], "5":[ 7.845,25.003 ], "6":[ -6.303,25.777 ],
        "26":[-13.397,13.165], "27":[ -5.952,11.540], "28":[ 3.896,11.465],
        "29":[ 10.144,15.864], "30":[ -9.586,21.086], "31":[ -4.965,20.442],
        "32":[  2.110,19.457], "33":[ -3.79,24.68 ], "34":[  2.21,24.68 ]
      }
    },

    {
      "time": 1.0,
      "description": "Mahomes hitches; pocket holds; WRs at 24–25 m depth.",
      "summary": {
        "offense_kc": "Perine scans protection; Worthy at 26 m seam; Hopkins settles mid-hash.",
        "defense_phi": "Safeties rotate (Blankenship to MOF); Baun drops 20 m; DeJean mirrors Worthy."
      },
      "ball": { "x": -1.07, "z": 29.21 },
      "positions": {
        "1":[ -0.800,28.700 ], "2":[ 1.897,28.112 ], "3":[-10.015,26.032],
        "4":[ -8.637,24.629 ],"5":[ 7.935,24.722 ],"6":[ -6.090,25.730 ],
        "26":[-13.205,12.940],"27":[ -6.060,11.000],"28":[ 4.452,11.434],
        "29":[ 10.139,15.541],"30":[ -9.455,21.023],"31":[ -4.769,20.486],
        "32":[  2.186,19.507],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 1.4,
      "description": "Mahomes climbs; reads right seam; Slay drives down on Brown dig.",
      "summary": {
        "offense_kc": "Brown crossing 23 m; Gray chip-releases; pocket starts to compress left.",
        "defense_phi": "LBs squeeze hook; Gardner-Johnson rotates low-hole; DeJean eyes QB."
      },
      "ball": { "x": -0.22, "z": 29.86 },
      "positions": {
        "1":[ -0.474,29.337 ],"2":[ 0.912,27.775 ],"3":[-10.389,24.879],
        "4":[ -8.639,23.129 ],"5":[ 7.656,23.249 ],"6":[ -5.266,26.167 ],
        "26":[-13.705,12.195],"27":[ -6.790,10.425],"28":[ 4.418,11.101],
        "29":[ 10.209,15.057],"30":[ -9.493,20.651],"31":[ -5.397,20.385],
        "32":[  2.114,19.885],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 2.0,
      "description": "QB scrambles right hash; Worthy stems post; Hopkins sits in curl.",
      "summary": {
        "offense_kc": "Mahomes extends play to 31 m; line slides; receivers reset depths.",
        "defense_phi": "Zone integrity holds; Slay cap on Worthy; DeJean starts downhill."
      },
      "ball": { "x": -0.80, "z": 31.56 },
      "positions": {
        "1":[ -0.528,31.052 ],"2":[ -2.164,27.805 ],"3":[-11.572,21.777],
        "4":[ -7.827,19.686 ],"5":[ 5.986,20.231 ],"6":[ -4.317,26.573 ],
        "26":[-14.421,10.409],"27":[ -7.140, 8.458],"28":[ 2.894, 9.602],
        "29":[ 10.515,14.334],"30":[ -8.900,18.940],"31":[ -4.907,20.195],
        "32":[  2.035,20.576],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 2.4,
      "description": "Mahomes rolls; launches toward Brown deep-dig window.",
      "summary": {
        "offense_kc": "Throw begins; Brown at 16 m depth; other WRs clear sidelines.",
        "defense_phi": "DeJean jumps route; Slay bracket outside; LBs drift with QB eyes."
      },
      "ball": { "x": -2.22, "z": 32.80 },
      "positions": {
        "1":[ -1.763,32.450 ],"2":[ -5.106,27.921 ],"3":[-12.765,18.834],
        "4":[ -7.012,17.390 ],"5":[ 4.122,17.640 ],"6":[ -5.193,26.795 ],
        "26":[-14.790, 9.197],"27":[ -7.936, 6.876],"28":[ 1.925, 8.168],
        "29":[  9.252,13.363],"30":[ -9.385,17.419],"31":[ -5.672,19.657],
        "32":[  0.801,20.153],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 3.0,
      "description": "Ball in flight – apex at 33.6 m; DeJean closes distance rapidly.",
      "summary": {
        "offense_kc": "Mahomes trailing 1 m behind ball arc; Perine leaks flat.",
        "defense_phi": "DeJean within 2 m of target; Gardner-Johnson drifts back-stop."
      },
      "ball": { "x": -5.35, "z": 33.57 },
      "positions": {
        "1":[ -4.780,33.523 ],"2":[ -8.817,26.201 ],"3":[-15.290,14.414],
        "4":[ -6.169,11.549 ],"5":[ 2.058,13.746 ],"6":[ -5.549,27.392 ],
        "26":[-16.633, 7.211],"27":[ -9.342, 4.558],"28":[ 0.840, 5.458],
        "29":[  6.169,11.313],"30":[-11.920,16.199],"31":[ -8.528,18.966],
        "32":[ -1.766,19.924],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 3.4,
      "description": "Brown throttles for catch; DeJean undercuts; collision imminent.",
      "summary": {
        "offense_kc": "Hopkins mirrors QB scrambling window; Gray releases up seam.",
        "defense_phi": "Slay remains top-shoulder; DeJean inside-leverage at 1 m."
      },
      "ball": { "x": -7.81, "z": 33.14 },
      "positions": {
        "1":[ -7.254,33.292 ],"2":[-11.356,24.360 ],"3":[-16.372,11.032],
        "4":[ -6.400, 8.784 ],"5":[ 0.980,12.046 ],"6":[ -5.628,27.401 ],
        "26":[-17.649, 5.966],"27":[-10.008, 3.335],"28":[ 0.470, 4.219],
        "29":[  4.140,10.058],"30":[-13.532,15.330],"31":[-10.538,19.039],
        "32":[ -3.071,20.295],"33":[ -3.79,24.68 ],"34":[  2.21,24.68 ]
      }
    },

    {
      "time": 4.0,
      "description": "Pass sails high; Glances hands; deflects off Brown.",
      "summary": {
        "offense_kc": "Ball deflection at 31 m; Brown fails to secure; pocket collapses.",
        "defense_phi": "DeJean tips ball; Blankenship rallies; Slay ready for tip-drill."
      },
      "ball": { "x": -11.35, "z": 31.17 },
      "positions": {
        "1":[-10.879,31.492], "2":[-14.973,22.770], "3":[-16.354, 6.377],
        "4":[ -8.723, 3.336], "5":[ -3.329, 9.213], "6":[ -8.278,27.599],
        "26":[-17.403, 3.853], "27":[-11.473,-0.295], "28":[ -1.206,-0.026],
        "29":[ -1.598, 7.455], "30":[-15.503,12.997], "31":[-15.157,19.626],
        "32":[ -7.680,21.000], "33":[ -3.79,24.68 ], "34":[  2.21,24.68 ]
      }
    },

    {
      "time": 4.5,
      "description": "Ricochet drops to linebacker depth; DeJean tracks toward hash.",
      "summary": {
        "offense_kc": "Receivers convert to tackle; Mahomes chases pass lane.",
        "defense_phi": "DeJean aligns under ball; LBs fan out for blocks."
      },
      "ball": { "x": -14.32, "z": 18.38 },
      "positions": {
        "1":[-13.218,28.941], "2":[-17.760,21.927], "3":[-17.126, 4.873],
        "4":[ -9.638, 1.670], "5":[ -6.593, 8.159], "6":[-10.707,27.027],
        "26":[-17.437, 4.258], "27":[-12.395,-1.855], "28":[ -2.167,-2.251],
        "29":[ -5.313, 6.845], "30":[-15.956,12.103], "31":[-17.181,19.418],
        "32":[-10.737,22.228], "33":[ -3.79,24.68 ], "34":[  2.21,24.68 ]
      }
    },

    {
      "time": 4.7,
      "description": "Interception – Cooper DeJean secures ball at PHI 10-m mark, turns up field.",
      "summary": {
        "offense_kc": "Immediate pursuit: Brown, Hopkins, Perine sprint back.",
        "defense_phi": "DeJean possession; blocking convoy forms; Slay leads outside."
      },
      "ball": { "x": -16.28, "z": 10.48 },
      "positions": {
        "1":[-14.866,26.919], "2":[-20.837,20.897], "3":[-18.790, 5.318],
        "4":[-11.098,-1.094], "5":[-10.990, 6.944], "6":[-12.474,26.065],
        "26":[-18.718, 4.558], "27":[-13.550,-3.870], "28":[ -3.978,-4.920],
        "29":[-10.080, 7.085], "30":[-16.401,11.044], "31":[-19.991,19.172],
        "32":[-13.302,23.535], "33":[ -3.79,24.68 ], "34":[  2.21,24.68 ]
      },
      "note": "Interception: PHI new possession"
    }
  ]
}

// Export the play data with calculated open space distances
export const deJeanInterceptionPlay = calculateOpenSpace(deJeanInterceptionPlayRaw)

// Helper function to convert new format to old AnimationFrame format for compatibility
export function convertToAnimationFrames(playSequence: PlaySequence): any[] {
  return playSequence.plays.map(play => {
    const offense_kc: any[] = []
    const defense_phi: any[] = []
    
    // Group players by team
    playSequence.players.forEach(player => {
      const pos = play.positions[player.id.toString()]
      if (pos) {
        const playerData = {
          id: player.id,
          name: player.name,
          pos: pos
        }
        
        if (player.team === 'KC') {
          offense_kc.push(playerData)
        } else if (player.team === 'PHI') {
          defense_phi.push(playerData)
        }
      }
    })
    
    return {
      frame_time_seconds: play.time,
      ball: play.ball,
      offense_kc,
      defense_phi,
      note: play.note
    }
  })
}

// Create playerInfo from new format for compatibility
export function createPlayerInfo(playSequence: PlaySequence) {
  const info: any = {
    offense_kc: {},
    defense_phi: {}
  }
  
  playSequence.players.forEach(player => {
    const playerData = {
      name: player.name,
      position: player.position,
      number: getJerseyNumber(player.name, player.position)
    }
    
    if (player.team === 'KC') {
      info.offense_kc[player.id] = playerData
    } else if (player.team === 'PHI') {
      info.defense_phi[player.id] = playerData
    }
  })
  
  return info
}

// Jersey number mapping
function getJerseyNumber(name: string, position: string): number | null {
  const knownNumbers: { [key: string]: number } = {
    'Patrick Mahomes': 15,
    'Cooper DeJean': 33,
    'Hollywood Brown': 17,
    'DeAndre Hopkins': 10,
    'Travis Kelce': 87,
    'Darius Slay': 2,
    'C.J. Gardner-Johnson': 8,
    'Reed Blankenship': 32,
    'Zack Baun': 53,
    'Noah Gray': 83,
    'Xavier Worthy': 1,
    'Samaje Perine': 34,
    'Quinyon Mitchell': 27,
    'Oren Burks': 42
  }
  return knownNumbers[name] || null
}

// Calculate open space distances for all players
export function calculateOpenSpace(playSequence: PlaySequence): PlaySequence {
  const updatedPlays = playSequence.plays.map(play => {
    const open_space_offense: { [id: string]: number } = {}
    const open_space_defense: { [id: string]: number } = {}
    
    // Get KC and PHI player IDs
    const kcPlayerIds = playSequence.players
      .filter(p => p.team === 'KC')
      .map(p => p.id.toString())
    const phiPlayerIds = playSequence.players
      .filter(p => p.team === 'PHI')
      .map(p => p.id.toString())
    
    // Calculate minimum distance for each KC player to nearest PHI player
    kcPlayerIds.forEach(kcId => {
      const kcPos = play.positions[kcId]
      if (!kcPos) return
      
      let minDist = Infinity
      phiPlayerIds.forEach(phiId => {
        const phiPos = play.positions[phiId]
        if (!phiPos) return
        
        const dist = Math.sqrt(
          Math.pow(kcPos[0] - phiPos[0], 2) + 
          Math.pow(kcPos[1] - phiPos[1], 2)
        )
        minDist = Math.min(minDist, dist)
      })
      
      open_space_offense[kcId] = Math.round(minDist * 10) / 10 // Round to 1 decimal
    })
    
    // Calculate minimum distance for each PHI player to nearest KC player
    phiPlayerIds.forEach(phiId => {
      const phiPos = play.positions[phiId]
      if (!phiPos) return
      
      let minDist = Infinity
      kcPlayerIds.forEach(kcId => {
        const kcPos = play.positions[kcId]
        if (!kcPos) return
        
        const dist = Math.sqrt(
          Math.pow(phiPos[0] - kcPos[0], 2) + 
          Math.pow(phiPos[1] - kcPos[1], 2)
        )
        minDist = Math.min(minDist, dist)
      })
      
      open_space_defense[phiId] = Math.round(minDist * 10) / 10 // Round to 1 decimal
    })
    
    return {
      ...play,
      open_space_offense,
      open_space_defense
    }
  })
  
  return {
    ...playSequence,
    plays: updatedPlays
  }
}