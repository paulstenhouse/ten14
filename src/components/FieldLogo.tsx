import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function FieldLogo() {
  const texture = useTexture('https://sportgpt.pages.dev/assets/ten14logo-AuV9iT5b.png')
  
  // Configure texture to have transparency
  texture.transparent = true
  
  return (
    <mesh 
      position={[0, 0.15, 35]} 
      rotation={[-Math.PI / 2, 0, 0]} // Flat on ground, outside field
    >
      <planeGeometry args={[20, 8]} /> {/* Logo size outside field */}
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.6} 
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}