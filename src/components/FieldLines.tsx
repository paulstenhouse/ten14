import * as THREE from 'three'
import {
  FIELD_LENGTH,
  FIELD_WIDTH,
  END_ZONE_DEPTH,
  YARD_TO_METER,
  BORDER_WIDTH,
  GOAL_LINE_WIDTH,
  YARD_LINE_WIDTH,
  LINE_WHITE,
} from '../constants'

export default function FieldLines() {
  const lines = []
  const lineHeight = 0.12 // Just above the field surface

  // Sideline borders (6 feet wide)
  lines.push(
    <mesh
      key="sideline-border-1"
      position={[0, lineHeight, (FIELD_WIDTH * YARD_TO_METER) / 2 + BORDER_WIDTH / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[FIELD_LENGTH * YARD_TO_METER, BORDER_WIDTH]} />
      <meshBasicMaterial color={LINE_WHITE} side={THREE.DoubleSide} />
    </mesh>,
  )

  lines.push(
    <mesh
      key="sideline-border-2"
      position={[0, lineHeight, -(FIELD_WIDTH * YARD_TO_METER) / 2 - BORDER_WIDTH / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[FIELD_LENGTH * YARD_TO_METER, BORDER_WIDTH]} />
      <meshBasicMaterial color={LINE_WHITE} side={THREE.DoubleSide} />
    </mesh>,
  )

  // End line borders (6 feet wide)
  lines.push(
    <mesh
      key="endline-border-1"
      position={[(FIELD_LENGTH * YARD_TO_METER) / 2 + BORDER_WIDTH / 2, lineHeight, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[BORDER_WIDTH, FIELD_WIDTH * YARD_TO_METER + 2 * BORDER_WIDTH]} />
      <meshBasicMaterial color={LINE_WHITE} side={THREE.DoubleSide} />
    </mesh>,
  )

  lines.push(
    <mesh
      key="endline-border-2"
      position={[-(FIELD_LENGTH * YARD_TO_METER) / 2 - BORDER_WIDTH / 2, lineHeight, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[BORDER_WIDTH, FIELD_WIDTH * YARD_TO_METER + 2 * BORDER_WIDTH]} />
      <meshBasicMaterial color={LINE_WHITE} side={THREE.DoubleSide} />
    </mesh>,
  )

  // Goal lines (8 inches wide)
  const goalLinePosition = ((FIELD_LENGTH - 2 * END_ZONE_DEPTH) * YARD_TO_METER) / 2

  lines.push(
    <mesh key="goalline-1" position={[goalLinePosition, lineHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[GOAL_LINE_WIDTH, FIELD_WIDTH * YARD_TO_METER]} />
      <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>,
  )

  lines.push(
    <mesh key="goalline-2" position={[-goalLinePosition, lineHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[GOAL_LINE_WIDTH, FIELD_WIDTH * YARD_TO_METER]} />
      <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>,
  )

  // Yard lines every 5 yards (4 inches wide)
  for (let yard = 5; yard <= 95; yard += 5) {
    const xPos = (yard - 50) * YARD_TO_METER
    lines.push(
      <mesh key={`yardline-${yard}`} position={[xPos, lineHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[YARD_LINE_WIDTH, FIELD_WIDTH * YARD_TO_METER]} />
        <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>,
    )
  }

  // 50-yard line (4 inches wide)
  lines.push(
    <mesh key="50-yard-line" position={[0, lineHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[YARD_LINE_WIDTH, FIELD_WIDTH * YARD_TO_METER]} />
      <meshBasicMaterial color={LINE_WHITE} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>,
  )

  return <>{lines}</>
}