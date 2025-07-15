// Unit conversions
export const YARD_TO_METER = 0.9144
export const FOOT_TO_METER = 0.3048
export const INCH_TO_METER = 0.0254

// Field dimensions in yards
export const FIELD_LENGTH = 120 // Total length including end zones
export const FIELD_WIDTH = 53.33 // 160 feet = 53.33 yards
export const END_ZONE_DEPTH = 10
export const PLAYING_FIELD_LENGTH = 100 // Without end zones

// Line dimensions
export const BORDER_WIDTH = 6 * FOOT_TO_METER
export const GOAL_LINE_WIDTH = 8 * INCH_TO_METER
export const YARD_LINE_WIDTH = 4 * INCH_TO_METER
export const HASH_WIDTH = 4 * INCH_TO_METER
export const HASH_LENGTH = 2 * FOOT_TO_METER
export const YELLOW_LINE_WIDTH = 8 * INCH_TO_METER
export const WHITE_RESTRICTION_WIDTH = 4 * INCH_TO_METER

// Distances
export const INBOUND_DISTANCE = (70 + 9/12) * FOOT_TO_METER / 2 // 70'9" from sidelines
export const YELLOW_RESTRICTION_DISTANCE = 9 * FOOT_TO_METER // 9 feet outside white border
export const WHITE_RESTRICTION_DISTANCE = 3 * FOOT_TO_METER // 3 feet inside yellow line
export const BENCH_AREA_START = 35 // Yard line where bench area starts
export const COACH_LINE_DISTANCE = 6 * FOOT_TO_METER // 6 feet behind border in bench area

// Colors
export const FIELD_GREEN = "#2d5a2d"
export const LINE_WHITE = "white"
export const RESTRICTION_YELLOW = "#FFD700"
export const PYLON_ORANGE = "orange"
export const CONCRETE_GRAY = "#888888"