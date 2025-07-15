import * as THREE from 'three'
import {
  YARD_TO_METER,
  HASH_WIDTH,
  HASH_LENGTH,
  INBOUND_DISTANCE,
  LINE_WHITE,
} from '../constants'

export default function HashMarks() {
  const hashMarks = []
  const hashHeight = 0.13 // Just above the field lines

  // Hash marks every yard from goal line to goal line
  for (let yard = -50; yard <= 50; yard++) {
    if (yard === 0) continue // Skip center line

    const xPos = yard * YARD_TO_METER

    // Left hash marks
    hashMarks.push(
      <mesh key={`hash-left-${yard}`} position={[xPos, hashHeight, INBOUND_DISTANCE]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HASH_WIDTH, HASH_LENGTH]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>,
    )

    // Right hash marks
    hashMarks.push(
      <mesh key={`hash-right-${yard}`} position={[xPos, hashHeight, -INBOUND_DISTANCE]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HASH_WIDTH, HASH_LENGTH]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>,
    )
  }

  return <>{hashMarks}</>
}