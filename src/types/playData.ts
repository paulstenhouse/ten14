export interface PlayerPosition {
  id: number
  name: string
  position: string
  x: number // meters from field center (negative = left)
  z: number // meters from 50-yard line (positive = toward PHI endzone)
}

export interface BallPosition {
  x: number
  z: number
}

export interface PlayData {
  description: string
  frame_time_seconds: number
  ball: BallPosition
  offense_kc: PlayerPosition[]
  defense_phi: PlayerPosition[]
}

// Simplified position format for animation frames
export interface AnimationPlayerPos {
  id: number
  name?: string
  pos: [number, number] // [x, z]
}

export interface AnimationFrame {
  frame_time_seconds: number
  ball: { x: number; z: number }
  offense_kc: AnimationPlayerPos[]
  defense_phi: AnimationPlayerPos[]
}

// Example play data - Cooper DeJean's interception
export const deJeanInterceptionData: PlayData = {
  "description": "Approximate locations at the moment Cooper DeJean intercepted Patrick Mahomes' pass (≈ 4.7 s). Positive z-axis points toward the Eagles' end-zone; x = 0 is the field mid-line.",
  "frame_time_seconds": 4.73,
  "ball": { "x": -15.95, "z": 10.46 },
  "offense_kc": [
    { "id": 1,  "name": "Patrick Mahomes",  "position": "QB", "x": -15.34, "z": 26.63 },
    { "id": 4,  "name": "Hollywood Brown", "position": "WR", "x": -11.56, "z": -1.37 },
    { "id": 3,  "name": "Xavier Worthy",   "position": "WR", "x": -19.28, "z":  5.48 },
    { "id": 5,  "name": "DeAndre Hopkins",  "position": "WR", "x": -11.71, "z":  6.56 },
    { "id": 2,  "name": "Samaje Perine",    "position": "RB", "x": -21.36, "z": 20.52 },
    { "id": 6,  "name": "Noah Gray",        "position": "TE", "x": -13.55, "z": 25.17 }
  ],
  "defense_phi": [
    { "id": 30, "name": "Cooper DeJean",          "position": "CB",  "x": -13.65, "z": 10.45 },
    { "id": 26, "name": "Darius Slay",            "position": "CB",  "x": -19.60, "z":  4.98 },
    { "id": 29, "name": "Quinyon Mitchell",       "position": "CB",  "x": -11.05, "z":  7.09 },
    { "id": 27, "name": "C.J. Gardner-Johnson",   "position": "S",   "x": -14.19, "z": -4.72 },
    { "id": 28, "name": "Reed Blankenship",       "position": "S",   "x":  -4.51, "z": -5.23 },
    { "id": 31, "name": "Zack Baun",              "position": "LB",  "x": -20.60, "z": 19.01 },
    { "id": 32, "name": "Oren Burks",             "position": "LB",  "x": -14.79, "z": 23.81 }
  ]
}

// Complete animation sequence for the play with all 22 players
export const deJeanInterceptionAnimation: AnimationFrame[] = [
  {
    "frame_time_seconds": 0.0,
    "ball": { "x": -0.79, "z": 24.68 },
    "offense_kc": [
      {"id": 1,  "name": "Mahomes",  "pos": [-0.90, 28.42]},
      {"id": 2,  "name": "Perine",   "pos": [ 1.82, 28.17]},
      {"id": 3,  "name": "Worthy",   "pos": [-10.22, 26.16]},
      {"id": 4,  "name": "Brown",    "pos": [ -8.57, 25.03]},
      {"id": 5,  "name": "Hopkins",  "pos": [  7.81, 25.05]},
      {"id": 6,  "name": "Gray",     "pos": [ -6.17, 25.80]},
      {"id": 7,  "name": "LT",       "pos": [ -4.00, 27.50]},
      {"id": 8,  "name": "LG",       "pos": [ -1.50, 27.80]},
      {"id": 9,  "name": "C",        "pos": [  0.80, 27.80]},
      {"id": 10, "name": "RG",       "pos": [  3.10, 27.50]},
      {"id": 11, "name": "RT",       "pos": [  5.55, 27.10]}
    ],
    "defense_phi": [
      {"id": 30, "name": "DeJean",      "pos": [ -9.28, 21.24]},
      {"id": 26, "name": "Slay",        "pos": [-13.24, 13.41]},
      {"id": 29, "name": "Mitchell",    "pos": [  9.90, 16.27]},
      {"id": 27, "name": "Gardner-J.",  "pos": [ -5.66, 11.95]},
      {"id": 28, "name": "Blankenship", "pos": [  3.50, 11.45]},
      {"id": 31, "name": "Baun",        "pos": [ -5.04, 20.20]},
      {"id": 32, "name": "Burks",       "pos": [  2.08, 19.55]},
      {"id": 33, "name": "Pass-Rush1",  "pos": [ -3.79, 24.68]},
      {"id": 34, "name": "Pass-Rush2",  "pos": [  2.21, 24.68]}
    ]
  },
  {
    "frame_time_seconds": 0.5,
    "ball": { "x": -0.80,  "z": 24.93 },
    "offense_kc": [
      {"id": 1, "pos": [ -0.91, 28.42 ]},
      {"id": 2, "pos": [  1.70, 28.30 ]},
      {"id": 3, "pos": [-10.43, 26.21 ]},
      {"id": 4, "pos": [ -8.63, 25.01 ]},
      {"id": 5, "pos": [  7.79, 25.06 ]},
      {"id": 6, "pos": [ -6.18, 25.74 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [ -9.51, 21.07 ]},
      {"id": 26, "pos": [-13.38, 13.15 ]},
      {"id": 29, "pos": [ 10.10, 15.53 ]},
      {"id": 27, "pos": [ -6.06, 11.00 ]},
      {"id": 28, "pos": [  4.06, 11.53 ]},
      {"id": 31, "pos": [ -4.98, 20.42 ]},
      {"id": 32, "pos": [  2.07, 19.49 ]}
    ]
  },
  {
    "frame_time_seconds": 1.0,
    "ball": { "x": -1.07,  "z": 29.21 },
    "offense_kc": [
      {"id": 1, "pos": [ -0.80, 28.70 ]},
      {"id": 2, "pos": [  1.90, 28.11 ]},
      {"id": 3, "pos": [-10.01, 26.03 ]},
      {"id": 4, "pos": [ -8.64, 24.63 ]},
      {"id": 5, "pos": [  7.94, 24.72 ]},
      {"id": 6, "pos": [ -6.09, 25.73 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [ -9.46, 21.02 ]},
      {"id": 26, "pos": [-13.21, 12.94 ]},
      {"id": 29, "pos": [ 10.14, 15.54 ]},
      {"id": 27, "pos": [ -6.06, 11.00 ]},
      {"id": 28, "pos": [  4.45, 11.43 ]},
      {"id": 31, "pos": [ -4.77, 20.49 ]},
      {"id": 32, "pos": [  2.19, 19.51 ]}
    ]
  },
  {
    "frame_time_seconds": 1.5,
    "ball": { "x": -0.17,  "z": 30.11 },
    "offense_kc": [
      {"id": 1, "pos": [ -0.37, 29.57 ]},
      {"id": 2, "pos": [  0.58, 27.73 ]},
      {"id": 3, "pos": [-10.52, 24.53 ]},
      {"id": 4, "pos": [ -8.59, 22.71 ]},
      {"id": 5, "pos": [  7.51, 22.87 ]},
      {"id": 6, "pos": [ -4.96, 26.17 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [ -9.16, 18.96 ]},
      {"id": 26, "pos": [-13.70, 12.20 ]},
      {"id": 29, "pos": [ -1.60,  7.45 ]},
      {"id": 27, "pos": [ -6.79, 10.42 ]},
      {"id": 28, "pos": [  4.42, 11.10 ]},
      {"id": 31, "pos": [ -5.40, 20.38 ]},
      {"id": 32, "pos": [  2.11, 19.89 ]}
    ]
  },
  {
    "frame_time_seconds": 2.0,
    "ball": { "x": -0.80,  "z": 31.56 },
    "offense_kc": [
      {"id": 1, "pos": [ -0.53, 31.05 ]},
      {"id": 2, "pos": [ -2.16, 27.81 ]},
      {"id": 3, "pos": [-11.57, 21.78 ]},
      {"id": 4, "pos": [ -7.83, 19.69 ]},
      {"id": 5, "pos": [  5.99, 20.23 ]},
      {"id": 6, "pos": [ -4.32, 26.57 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [ -8.90, 18.94 ]},
      {"id": 26, "pos": [-14.42, 10.41 ]},
      {"id": 29, "pos": [ 10.52, 14.33 ]},
      {"id": 27, "pos": [ -7.14,  8.46 ]},
      {"id": 28, "pos": [  2.89,  9.60 ]},
      {"id": 31, "pos": [ -4.91, 20.20 ]},
      {"id": 32, "pos": [  2.04, 20.58 ]}
    ]
  },
  {
    "frame_time_seconds": 2.5,
    "ball": { "x": -3.10,  "z": 33.21 },
    "offense_kc": [
      {"id": 1, "pos": [ -3.10, 33.17 ]},
      {"id": 2, "pos": [ -6.35, 27.62 ]},
      {"id": 3, "pos": [-13.50, 17.50 ]},
      {"id": 4, "pos": [ -6.46, 15.09 ]},
      {"id": 5, "pos": [  3.25, 16.40 ]},
      {"id": 6, "pos": [ -5.56, 26.97 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [-11.36, 15.97 ]},
      {"id": 26, "pos": [-15.46,  8.31 ]},
      {"id": 29, "pos": [ -6.25,  6.83 ]},
      {"id": 27, "pos": [ -8.50,  6.16 ]},
      {"id": 28, "pos": [  1.77,  7.81 ]},
      {"id": 31, "pos": [ -6.38, 19.23 ]},
      {"id": 32, "pos": [ -0.02, 20.08 ]}
    ]
  },
  {
    "frame_time_seconds": 3.0,
    "ball": { "x": -5.35,  "z": 33.57 },
    "offense_kc": [
      {"id": 1, "pos": [ -4.78, 33.52 ]},
      {"id": 2, "pos": [ -8.82, 26.20 ]},
      {"id": 3, "pos": [-15.29, 14.41 ]},
      {"id": 4, "pos": [ -6.17, 11.55 ]},
      {"id": 5, "pos": [  2.06, 13.75 ]},
      {"id": 6, "pos": [ -5.55, 27.39 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [-11.92, 16.20 ]},
      {"id": 26, "pos": [-16.63,  7.21 ]},
      {"id": 29, "pos": [  6.17, 11.31 ]},
      {"id": 27, "pos": [ -9.34,  4.56 ]},
      {"id": 28, "pos": [  0.84,  5.46 ]},
      {"id": 31, "pos": [ -8.53, 18.97 ]},
      {"id": 32, "pos": [ -1.77, 19.92 ]}
    ]
  },
  {
    "frame_time_seconds": 3.5,
    "ball": { "x": -7.81,  "z": 33.14 },
    "offense_kc": [
      {"id": 1, "pos": [ -7.87, 33.10 ]},
      {"id": 2, "pos": [-11.99, 24.01 ]},
      {"id": 3, "pos": [-16.45, 10.19 ]},
      {"id": 4, "pos": [ -6.84,  7.02 ]},
      {"id": 5, "pos": [ -0.03, 11.54 ]},
      {"id": 6, "pos": [ -6.40, 27.55 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [-14.20, 14.65 ]},
      {"id": 26, "pos": [-17.85,  5.11 ]},
      {"id": 29, "pos": [  3.40,  9.63 ]},
      {"id": 27, "pos": [-10.43,  2.33 ]},
      {"id": 28, "pos": [  0.11,  3.17 ]},
      {"id": 31, "pos": [-11.99, 19.30 ]},
      {"id": 32, "pos": [ -4.20, 20.53 ]}
    ]
  },
  {
    "frame_time_seconds": 4.0,
    "ball": { "x": -11.35, "z": 31.17 },
    "offense_kc": [
      {"id": 1, "pos": [-10.88, 31.49 ]},
      {"id": 2, "pos": [-14.97, 22.77 ]},
      {"id": 3, "pos": [-16.35,  6.38 ]},
      {"id": 4, "pos": [ -8.72,  3.34 ]},
      {"id": 5, "pos": [ -3.33,  9.21 ]},
      {"id": 6, "pos": [ -8.28, 27.60 ]}
    ],
    "defense_phi": [
      {"id": 30, "pos": [-15.50, 13.00 ]},
      {"id": 26, "pos": [-17.40,  3.85 ]},
      {"id": 29, "pos": [ -1.60,  7.45 ]},
      {"id": 27, "pos": [-11.47, -0.30 ]},
      {"id": 28, "pos": [ -1.21, -0.03 ]},
      {"id": 31, "pos": [-15.16, 19.63 ]},
      {"id": 32, "pos": [ -7.68, 21.00 ]}
    ]
  }
]

// Map player info from first frame
export const playerInfo = {
  offense_kc: {
    1: { name: "Patrick Mahomes", position: "QB", number: 15 },
    2: { name: "Samaje Perine", position: "RB", number: 34 },
    3: { name: "Xavier Worthy", position: "WR", number: 1 },
    4: { name: "Hollywood Brown", position: "WR", number: 17 },
    5: { name: "DeAndre Hopkins", position: "WR", number: 10 },
    6: { name: "Noah Gray", position: "TE", number: 83 }
  },
  defense_phi: {
    30: { name: "Cooper DeJean", position: "CB", number: 33 },
    26: { name: "Darius Slay", position: "CB", number: 2 },
    29: { name: "Quinyon Mitchell", position: "CB", number: 27 },
    27: { name: "C.J. Gardner-Johnson", position: "S", number: 8 },
    28: { name: "Reed Blankenship", position: "S", number: 32 },
    31: { name: "Zack Baun", position: "LB", number: 53 },
    32: { name: "Oren Burks", position: "LB", number: 42 }
  }
}