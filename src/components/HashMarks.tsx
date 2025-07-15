import {
  YARD_TO_METER,
  HASH_WIDTH,
  HASH_LENGTH,
  INBOUND_DISTANCE,
  LINE_WHITE,
} from '../constants'

export default function HashMarks() {
  const hashMarks = []
  const hashHeight = 0.12 // Above the field surface and lines

  // Hash marks every yard from goal line to goal line
  for (let yard = -50; yard <= 50; yard++) {
    if (yard === 0) continue // Skip center line

    const xPos = yard * YARD_TO_METER

    // Left hash marks
    hashMarks.push(
      <mesh key={`hash-left-${yard}`} position={[xPos, hashHeight, INBOUND_DISTANCE]} castShadow>
        <boxGeometry args={[HASH_WIDTH, hashHeight, HASH_LENGTH]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>,
    )

    // Right hash marks
    hashMarks.push(
      <mesh key={`hash-right-${yard}`} position={[xPos, hashHeight, -INBOUND_DISTANCE]} castShadow>
        <boxGeometry args={[HASH_WIDTH, hashHeight, HASH_LENGTH]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.3} />
      </mesh>,
    )
  }

  return <>{hashMarks}</>
}