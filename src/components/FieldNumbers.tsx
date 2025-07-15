import { Text } from '@react-three/drei'
import {
  YARD_TO_METER,
  FIELD_WIDTH,
  LINE_WHITE,
  FOOT_TO_METER,
  INCH_TO_METER,
} from '../constants'

export default function FieldNumbers() {
  const numbers = []
  const numberHeight = 0.5 // Higher above the field to avoid z-fighting
  const fontSize = 6 * FOOT_TO_METER // 6 feet tall numbers
  
  // Distance from sideline (12 feet per NFL specs)
  const numberDistance = (FIELD_WIDTH * YARD_TO_METER) / 2 - 12 * FOOT_TO_METER

  // Create numbers for both sides of the field
  for (let yard = 10; yard <= 50; yard += 10) {
    // Left side going up
    const leftXPos = (yard - 50) * YARD_TO_METER
    
    numbers.push(
      <Text
        key={`number-left-top-${yard}`}
        position={[leftXPos, numberHeight, numberDistance]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={fontSize}
        color={LINE_WHITE}
        anchorX="center"
        anchorY="middle"
      >
        {yard === 50 ? '50' : yard.toString()}
      </Text>
    )
    
    numbers.push(
      <Text
        key={`number-left-bottom-${yard}`}
        position={[leftXPos, numberHeight, -numberDistance]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        fontSize={fontSize}
        color={LINE_WHITE}
        anchorX="center"
        anchorY="middle"
      >
        {yard === 50 ? '50' : yard.toString()}
      </Text>
    )

    // Right side (mirrored except for 50)
    if (yard !== 50) {
      const rightXPos = (50 - yard) * YARD_TO_METER
      
      numbers.push(
        <Text
          key={`number-right-top-${yard}`}
          position={[rightXPos, numberHeight, numberDistance]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={LINE_WHITE}
          anchorX="center"
          anchorY="middle"
        >
          {yard.toString()}
        </Text>
      )
      
      numbers.push(
        <Text
          key={`number-right-bottom-${yard}`}
          position={[rightXPos, numberHeight, -numberDistance]}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          fontSize={fontSize}
          color={LINE_WHITE}
          anchorX="center"
          anchorY="middle"
        >
          {yard.toString()}
        </Text>
      )
    }
  }

  // Add directional arrows
  const arrowSize = 36 * INCH_TO_METER
  const arrowWidth = 18 * INCH_TO_METER
  const arrowOffset = 15 * INCH_TO_METER // 15 inches below top of number
  
  for (let yard = 10; yard <= 40; yard += 10) {
    // Left side arrows pointing right
    const leftXPos = (yard - 50) * YARD_TO_METER
    
    // Top left arrow
    numbers.push(
      <mesh
        key={`arrow-left-top-${yard}`}
        position={[leftXPos, numberHeight, numberDistance - fontSize/2 - arrowOffset]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[arrowWidth/2, arrowSize, 3]} />
        <meshBasicMaterial color={LINE_WHITE} />
      </mesh>
    )
    
    // Bottom left arrow
    numbers.push(
      <mesh
        key={`arrow-left-bottom-${yard}`}
        position={[leftXPos, numberHeight, -numberDistance + fontSize/2 + arrowOffset]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      >
        <coneGeometry args={[arrowWidth/2, arrowSize, 3]} />
        <meshBasicMaterial color={LINE_WHITE} />
      </mesh>
    )

    // Right side arrows pointing left
    const rightXPos = (50 - yard) * YARD_TO_METER
    
    // Top right arrow
    numbers.push(
      <mesh
        key={`arrow-right-top-${yard}`}
        position={[rightXPos, numberHeight, numberDistance - fontSize/2 - arrowOffset]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      >
        <coneGeometry args={[arrowWidth/2, arrowSize, 3]} />
        <meshBasicMaterial color={LINE_WHITE} />
      </mesh>
    )
    
    // Bottom right arrow
    numbers.push(
      <mesh
        key={`arrow-right-bottom-${yard}`}
        position={[rightXPos, numberHeight, -numberDistance + fontSize/2 + arrowOffset]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[arrowWidth/2, arrowSize, 3]} />
        <meshBasicMaterial color={LINE_WHITE} />
      </mesh>
    )
  }

  return <>{numbers}</>
}