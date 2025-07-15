import * as THREE from 'three'
import { FIELD_LENGTH, FIELD_WIDTH, YARD_TO_METER } from '../constants'

export default function Dome() {
  // Dome dimensions - much larger to ensure complete coverage
  const domeRadius = 200 * YARD_TO_METER
  const domeHeight = 100 * YARD_TO_METER
  
  return (
    <group>
      {/* Dome ceiling */}
      <mesh position={[0, domeHeight, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          side={THREE.BackSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Dome walls - cylindrical section */}
      <mesh position={[0, domeHeight / 2, 0]}>
        <cylinderGeometry args={[domeRadius, domeRadius, domeHeight, 32, 1, true]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          side={THREE.BackSide}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Stadium floor */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[domeRadius, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Stadium lighting rings */}
      {[0, 120, 240].map((angle, index) => (
        <group key={`light-ring-${index}`} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <mesh position={[0, domeHeight - 5, domeRadius * 0.8]}>
            <torusGeometry args={[5, 0.5, 8, 32]} />
            <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <pointLight
            position={[0, domeHeight - 5, domeRadius * 0.8]}
            intensity={100}
            distance={200}
            color="#ffffff"
          />
        </group>
      ))}
      
      {/* Lower stadium lights around the perimeter */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2
        const x = Math.sin(angle) * domeRadius * 0.9
        const z = Math.cos(angle) * domeRadius * 0.9
        
        return (
          <group key={`stadium-light-${index}`}>
            <mesh position={[x, 30, z]}>
              <boxGeometry args={[2, 4, 2]} />
              <meshStandardMaterial emissive="#ffffff" emissiveIntensity={1.5} />
            </mesh>
            <spotLight
              position={[x, 30, z]}
              target-position={[0, 0, 0]}
              intensity={50}
              angle={Math.PI / 4}
              penumbra={0.5}
              distance={150}
              color="#ffffff"
            />
          </group>
        )
      })}
    </group>
  )
}