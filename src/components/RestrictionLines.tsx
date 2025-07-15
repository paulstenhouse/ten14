import {
  FIELD_LENGTH,
  FIELD_WIDTH,
  YARD_TO_METER,
  FOOT_TO_METER,
  INCH_TO_METER,
  BORDER_WIDTH,
  YELLOW_RESTRICTION_DISTANCE,
  WHITE_RESTRICTION_DISTANCE,
  BENCH_AREA_START,
  COACH_LINE_DISTANCE,
  RESTRICTION_YELLOW,
  LINE_WHITE,
  END_ZONE_DEPTH,
} from '../constants'

export default function RestrictionLines() {
  const lines = []
  const yellowLineHeight = 0.13 // Above field surface and other lines
  const whiteLineHeight = 0.14 // Above yellow lines
  const yellowLineWidth = 8 * INCH_TO_METER
  const whiteLineWidth = 4 * INCH_TO_METER
  const segmentLength = 2 * FOOT_TO_METER
  const gapLength = 1 * FOOT_TO_METER
  
  // Calculate positions
  const sidelineEdge = (FIELD_WIDTH * YARD_TO_METER) / 2 + BORDER_WIDTH
  const yellowLineDistance = sidelineEdge + YELLOW_RESTRICTION_DISTANCE
  const whiteLineDistance = yellowLineDistance - WHITE_RESTRICTION_DISTANCE
  const coachLineDistance = sidelineEdge + COACH_LINE_DISTANCE

  // Bench area positions (between 35-yard lines)
  const benchStart = (BENCH_AREA_START - 50) * YARD_TO_METER
  const benchEnd = (50 - BENCH_AREA_START) * YARD_TO_METER

  // Create broken yellow lines along sidelines
  const fieldStart = -(FIELD_LENGTH * YARD_TO_METER) / 2
  const fieldEnd = (FIELD_LENGTH * YARD_TO_METER) / 2
  const segmentSpacing = segmentLength + gapLength

  // Non-bench area broken yellow lines
  for (let x = fieldStart; x < benchStart; x += segmentSpacing) {
    if (x + segmentLength > benchStart) break
    
    // Top sideline
    lines.push(
      <mesh key={`yellow-top-left-${x}`} position={[x + segmentLength/2, yellowLineHeight, yellowLineDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
    
    // Bottom sideline
    lines.push(
      <mesh key={`yellow-bottom-left-${x}`} position={[x + segmentLength/2, yellowLineHeight, -yellowLineDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
  }

  for (let x = benchEnd; x < fieldEnd; x += segmentSpacing) {
    if (x + segmentLength > fieldEnd) break
    
    // Top sideline
    lines.push(
      <mesh key={`yellow-top-right-${x}`} position={[x + segmentLength/2, yellowLineHeight, yellowLineDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
    
    // Bottom sideline
    lines.push(
      <mesh key={`yellow-bottom-right-${x}`} position={[x + segmentLength/2, yellowLineHeight, -yellowLineDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
  }

  // Solid yellow coach's line in bench areas
  lines.push(
    <mesh key="coach-line-top" position={[0, yellowLineHeight, coachLineDistance]} castShadow>
      <boxGeometry args={[(benchEnd - benchStart), yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )
  
  lines.push(
    <mesh key="coach-line-bottom" position={[0, yellowLineHeight, -coachLineDistance]} castShadow>
      <boxGeometry args={[(benchEnd - benchStart), yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )

  // Angled yellow lines from 30-yard lines
  const angleStart = (30 - 50) * YARD_TO_METER
  const angleEnd = benchStart
  const angleLength = Math.sqrt(Math.pow(angleEnd - angleStart, 2) + Math.pow(yellowLineDistance - coachLineDistance, 2))
  const angleRotation = Math.atan2(yellowLineDistance - coachLineDistance, angleEnd - angleStart)

  // Top left angle
  lines.push(
    <mesh 
      key="yellow-angle-top-left" 
      position={[(angleStart + angleEnd)/2, yellowLineHeight, (yellowLineDistance + coachLineDistance)/2]} 
      rotation={[0, -angleRotation, 0]}
      castShadow
    >
      <boxGeometry args={[angleLength, yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )

  // Top right angle
  lines.push(
    <mesh 
      key="yellow-angle-top-right" 
      position={[-(angleStart + angleEnd)/2, yellowLineHeight, (yellowLineDistance + coachLineDistance)/2]} 
      rotation={[0, angleRotation, 0]}
      castShadow
    >
      <boxGeometry args={[angleLength, yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )

  // Bottom angles (mirrored)
  lines.push(
    <mesh 
      key="yellow-angle-bottom-left" 
      position={[(angleStart + angleEnd)/2, yellowLineHeight, -(yellowLineDistance + coachLineDistance)/2]} 
      rotation={[0, angleRotation, 0]}
      castShadow
    >
      <boxGeometry args={[angleLength, yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )

  lines.push(
    <mesh 
      key="yellow-angle-bottom-right" 
      position={[-(angleStart + angleEnd)/2, yellowLineHeight, -(yellowLineDistance + coachLineDistance)/2]} 
      rotation={[0, -angleRotation, 0]}
      castShadow
    >
      <boxGeometry args={[angleLength, yellowLineHeight, yellowLineWidth]} />
      <meshBasicMaterial color={RESTRICTION_YELLOW} />
    </mesh>
  )

  // Broken white restriction lines (3 feet inside yellow line)
  const whiteSegmentLength = 4 * FOOT_TO_METER
  const whiteGapLength = 2 * FOOT_TO_METER
  const whiteSpacing = whiteSegmentLength + whiteGapLength

  // White lines in non-bench areas only
  for (let x = fieldStart; x < benchStart; x += whiteSpacing) {
    if (x + whiteSegmentLength > benchStart) break
    
    // Top sideline
    lines.push(
      <mesh key={`white-top-left-${x}`} position={[x + whiteSegmentLength/2, whiteLineHeight, whiteLineDistance]} castShadow>
        <boxGeometry args={[whiteSegmentLength, whiteLineHeight, whiteLineWidth]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>
    )
    
    // Bottom sideline
    lines.push(
      <mesh key={`white-bottom-left-${x}`} position={[x + whiteSegmentLength/2, whiteLineHeight, -whiteLineDistance]} castShadow>
        <boxGeometry args={[whiteSegmentLength, whiteLineHeight, whiteLineWidth]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>
    )
  }

  for (let x = benchEnd; x < fieldEnd; x += whiteSpacing) {
    if (x + whiteSegmentLength > fieldEnd) break
    
    // Top sideline
    lines.push(
      <mesh key={`white-top-right-${x}`} position={[x + whiteSegmentLength/2, whiteLineHeight, whiteLineDistance]} castShadow>
        <boxGeometry args={[whiteSegmentLength, whiteLineHeight, whiteLineWidth]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>
    )
    
    // Bottom sideline
    lines.push(
      <mesh key={`white-bottom-right-${x}`} position={[x + whiteSegmentLength/2, whiteLineHeight, -whiteLineDistance]} castShadow>
        <boxGeometry args={[whiteSegmentLength, whiteLineHeight, whiteLineWidth]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>
    )
  }

  // Yellow lines in end zones (6 feet from solid border)
  const endZoneYellowDistance = sidelineEdge + 6 * FOOT_TO_METER
  const goalLinePos = ((FIELD_LENGTH - 2 * END_ZONE_DEPTH) * YARD_TO_METER) / 2

  // Left end zone yellow lines
  for (let x = fieldStart; x < fieldStart + END_ZONE_DEPTH * YARD_TO_METER; x += segmentSpacing) {
    lines.push(
      <mesh key={`yellow-endzone-left-top-${x}`} position={[x + segmentLength/2, yellowLineHeight, endZoneYellowDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
    
    lines.push(
      <mesh key={`yellow-endzone-left-bottom-${x}`} position={[x + segmentLength/2, yellowLineHeight, -endZoneYellowDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
  }

  // Right end zone yellow lines
  for (let x = fieldEnd - END_ZONE_DEPTH * YARD_TO_METER; x < fieldEnd; x += segmentSpacing) {
    lines.push(
      <mesh key={`yellow-endzone-right-top-${x}`} position={[x + segmentLength/2, yellowLineHeight, endZoneYellowDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
    
    lines.push(
      <mesh key={`yellow-endzone-right-bottom-${x}`} position={[x + segmentLength/2, yellowLineHeight, -endZoneYellowDistance]} castShadow>
        <boxGeometry args={[segmentLength, yellowLineHeight, yellowLineWidth]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} transparent opacity={0.5} />
      </mesh>
    )
  }

  return <>{lines}</>
}