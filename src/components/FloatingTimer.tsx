import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface FloatingTimerProps {
  time: number
}

export default function FloatingTimer({ time }: FloatingTimerProps) {
  const { camera } = useThree()
  const textRef = useRef<any>(null)
  
  useFrame(() => {
    if (textRef.current) {
      // Position the timer in front of the camera
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      
      // Place timer 25 units in front of camera, closer to field
      const distance = 25
      const heightOffset = 3
      
      textRef.current.position.set(
        camera.position.x + direction.x * distance,
        camera.position.y + heightOffset,
        camera.position.z + direction.z * distance
      )
      
      // Make timer face the camera
      textRef.current.lookAt(camera.position)
    }
  })
  
  return (
    <Text
      ref={textRef}
      fontSize={2}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fontWeight="bold"
      outlineWidth={0.15}
      outlineColor="#000000"
    >
      {time.toFixed(1)}s
    </Text>
  )
}