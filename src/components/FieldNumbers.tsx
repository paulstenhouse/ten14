import { Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  YARD_TO_METER,
  FIELD_WIDTH,
  LINE_WHITE,
  FOOT_TO_METER,
  INCH_TO_METER,
} from '../constants'

export default function FieldNumbers() {
  const numbers = []
  const numberHeight = 0.15 // Raised to ensure visibility above field surface
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

  // Add directional arrows as flat 2D shapes
  const arrowLength = 36 * INCH_TO_METER
  const arrowWidth = 18 * INCH_TO_METER
  const arrowOffset = 15 * INCH_TO_METER // 15 inches below top of number
  
  // Create arrow shape
  const createArrowShape = () => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(-arrowWidth/2, -arrowLength/2)
    shape.lineTo(-arrowWidth/4, -arrowLength/2)
    shape.lineTo(-arrowWidth/4, -arrowLength)
    shape.lineTo(arrowWidth/4, -arrowLength)
    shape.lineTo(arrowWidth/4, -arrowLength/2)
    shape.lineTo(arrowWidth/2, -arrowLength/2)
    shape.closePath()
    return shape
  }
  
  const arrowShape = createArrowShape()
  
  for (let yard = 10; yard <= 40; yard += 10) {
    // Left side (negative X) - arrows point LEFT toward the nearest goal line (at x = -60)
    const leftXPos = (yard - 50) * YARD_TO_METER
    
    // Top left arrow - points left
    numbers.push(
      <mesh
        key={`arrow-left-top-${yard}`}
        position={[leftXPos, numberHeight, numberDistance - fontSize/2 - arrowOffset]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <shapeGeometry args={[arrowShape]} />
        <meshBasicMaterial color={LINE_WHITE} depthTest={false} />
      </mesh>
    )
    
    // Bottom left arrow - points left
    numbers.push(
      <mesh
        key={`arrow-left-bottom-${yard}`}
        position={[leftXPos, numberHeight, -numberDistance + fontSize/2 + arrowOffset]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <shapeGeometry args={[arrowShape]} />
        <meshBasicMaterial color={LINE_WHITE} depthTest={false} />
      </mesh>
    )

    // Right side (positive X) - arrows point RIGHT toward the nearest goal line (at x = 60)
    const rightXPos = (50 - yard) * YARD_TO_METER
    
    // Top right arrow - points right
    numbers.push(
      <mesh
        key={`arrow-right-top-${yard}`}
        position={[rightXPos, numberHeight, numberDistance - fontSize/2 - arrowOffset]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      >
        <shapeGeometry args={[arrowShape]} />
        <meshBasicMaterial color={LINE_WHITE} depthTest={false} />
      </mesh>
    )
    
    // Bottom right arrow - points right
    numbers.push(
      <mesh
        key={`arrow-right-bottom-${yard}`}
        position={[rightXPos, numberHeight, -numberDistance + fontSize/2 + arrowOffset]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      >
        <shapeGeometry args={[arrowShape]} />
        <meshBasicMaterial color={LINE_WHITE} depthTest={false} />
      </mesh>
    )
  }

  return <>{numbers}</>
}