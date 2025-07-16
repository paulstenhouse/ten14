import * as THREE from 'three'
import { FIELD_LENGTH, FIELD_WIDTH, YARD_TO_METER } from '../constants'
import { useEffect, useState } from 'react'

export default function Dome() {
  // Dome dimensions - much larger to ensure complete coverage
  const domeRadius = 200 * YARD_TO_METER
  const domeHeight = 100 * YARD_TO_METER
  
  // Check if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])
  
  // Theme-based colors
  // Floor uses main container color (zinc-900 in dark, white in light)
  const floorColor = isDarkMode ? '#18181b' : '#ffffff'
  // Dome uses page background color (zinc-950 in dark, gray-50 in light)
  const domeColor = isDarkMode ? '#09090b' : '#fafafa'
  const wallColor = isDarkMode ? '#09090b' : '#f5f5f5'
  
  return (
    <group>
      {/* Dome ceiling */}
      <mesh position={[0, domeHeight, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={domeColor} 
          side={THREE.BackSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Dome walls - cylindrical section */}
      <mesh position={[0, domeHeight / 2, 0]}>
        <cylinderGeometry args={[domeRadius, domeRadius, domeHeight, 32, 1, true]} />
        <meshStandardMaterial 
          color={wallColor} 
          side={THREE.BackSide}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Stadium floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[domeRadius, 32]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      
      {/* Blue accent border at bottom of dome */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[domeRadius - 2, domeRadius, 64]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Keep only the lights without visible geometry */}
      {[0, 120, 240].map((angle, index) => (
        <pointLight
          key={`light-ring-${index}`}
          position={[
            Math.sin((angle * Math.PI) / 180) * domeRadius * 0.8,
            domeHeight - 5,
            Math.cos((angle * Math.PI) / 180) * domeRadius * 0.8
          ]}
          intensity={100}
          distance={200}
          color="#ffffff"
        />
      ))}
      
      {/* Lower stadium lights without visible geometry */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2
        const x = Math.sin(angle) * domeRadius * 0.9
        const z = Math.cos(angle) * domeRadius * 0.9
        
        return (
          <spotLight
            key={`stadium-light-${index}`}
            position={[x, 30, z]}
            target-position={[0, 0, 0]}
            intensity={50}
            angle={Math.PI / 4}
            penumbra={0.5}
            distance={150}
            color="#ffffff"
          />
        )
      })}
    </group>
  )
}