import {
  FIELD_LENGTH,
  FIELD_WIDTH,
  END_ZONE_DEPTH,
  YARD_TO_METER,
  PYLON_ORANGE,
} from '../constants'

export default function Pylons() {
  const pylons = []
  const pylonHeight = 0.5
  const pylonWidth = 0.1

  // Goal line positions
  const goalLinePosition = ((FIELD_LENGTH - 2 * END_ZONE_DEPTH) * YARD_TO_METER) / 2
  const sidelinePosition = (FIELD_WIDTH * YARD_TO_METER) / 2

  // Four pylons at goal line/sideline intersections (inside corners of end zones)
  const pylonPositions = [
    [goalLinePosition, pylonHeight / 2, sidelinePosition],
    [goalLinePosition, pylonHeight / 2, -sidelinePosition],
    [-goalLinePosition, pylonHeight / 2, sidelinePosition],
    [-goalLinePosition, pylonHeight / 2, -sidelinePosition],
  ]

  pylonPositions.forEach((pos, index) => {
    pylons.push(
      <mesh key={`pylon-${index}`} position={pos} castShadow>
        <boxGeometry args={[pylonWidth, pylonHeight, pylonWidth]} />
        <meshBasicMaterial color={PYLON_ORANGE} />
      </mesh>,
    )
  })

  return <>{pylons}</>
}