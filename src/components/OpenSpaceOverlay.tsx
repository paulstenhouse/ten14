import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface OpenSpaceOverlayProps {
  playerId: string
  position: [number, number]
  openSpace: number
  isOffense: boolean
  showOverlay: boolean
}

export default function OpenSpaceOverlay({ 
  playerId, 
  position, 
  openSpace, 
  isOffense,
  showOverlay 
}: OpenSpaceOverlayProps) {
  const { camera } = useThree()
  
  if (!showOverlay) return null
  
  // Use a minimum open space value of 1
  const displaySpace = Math.max(1, openSpace)
  
  // Convert meters to feet and inches
  const metersToFeetInches = (meters: number) => {
    const totalFeet = meters * 3.28084
    const feet = Math.floor(totalFeet)
    const inches = Math.round((totalFeet - feet) * 12)
    
    // Handle edge case where inches round to 12
    if (inches === 12) {
      return `${feet + 1}'0"`
    }
    
    return `${feet}'${inches}"`
  }
  
  // Calculate angle for billboard effect
  const playerWorldPos = new THREE.Vector3(position[0], 0, position[1])
  const cameraWorldPos = camera.position.clone()
  const dx = cameraWorldPos.x - playerWorldPos.x
  const dz = cameraWorldPos.z - playerWorldPos.z
  const angle = Math.atan2(dx, dz)
  
  // Color based on open space (red = tight coverage, green = open)
  const getColor = (distance: number) => {
    if (distance < 2) return '#ff4444' // Red - very tight
    if (distance < 4) return '#ff8844' // Orange - tight
    if (distance < 6) return '#ffdd44' // Yellow - moderate
    if (distance < 8) return '#88ff44' // Light green - open
    return '#44ff44' // Green - very open
  }
  
  const color = getColor(displaySpace)
  const radius = Math.max(1.5, displaySpace * 0.4)
  
  return (
    <>
      {/* 3D Torus ring for visibility */}
      <mesh 
        position={[position[0], 0.1, position[1]]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[radius, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Flat ground indicator */}
      <mesh 
        position={[position[0], 0.01, position[1]]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius - 0.3, radius, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Distance text */}
      <Text
        position={[position[0], 2.5, position[1]]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[0, angle, 0]}
        fontWeight="bold"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {metersToFeetInches(displaySpace)}
      </Text>
    </>
  )
}