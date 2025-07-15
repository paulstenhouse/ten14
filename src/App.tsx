import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import NFLField from "./components/NFLField"
import { NFL_TEAMS, NFLTeam } from "./data/nflTeams"

// Camera animation component
function CameraController({ 
  targetView, 
  animationTrigger, 
  onAnimationComplete, 
  controlsRef,
  isAnimating 
}: { 
  targetView: number; 
  animationTrigger: number; 
  onAnimationComplete: () => void; 
  controlsRef: any;
  isAnimating: boolean;
}) {
  const { camera } = useThree()
  const lastTriggerRef = useRef(0)
  const animationRef = useRef<{
    startTime: number | null;
    toView: number;
    currentPosition?: THREE.Vector3;
    currentTarget?: THREE.Vector3;
  }>()

  // Dynamic camera views that follow the QB
  const getQBPosition = () => {
    const qbX = -5 * 0.9144 // YARD_TO_METER
    const qbZ = 0 * 0.9144
    return new THREE.Vector3(qbX, 1, qbZ) // QB center mass height
  }

  // Get MLB (Middle Linebacker) position for defense POV
  const getMLBPosition = () => {
    const mlbX = 0 * 0.9144
    const mlbZ = 0 * 0.9144
    return new THREE.Vector3(mlbX, 1.5, mlbZ) // Slightly higher for better view
  }

  const getCameraPresets = () => {
    const qbPos = getQBPosition()
    const mlbPos = getMLBPosition()

    return [
      {
        name: "Sideline View",
        position: new THREE.Vector3(qbPos.x, 20, qbPos.z + 35),
        target: qbPos,
      },
      {
        name: "Behind QB",
        position: new THREE.Vector3(qbPos.x - 15, 8, qbPos.z),
        target: qbPos,
      },
      {
        name: "Defense POV",
        position: new THREE.Vector3(mlbPos.x + 15, mlbPos.y + 10, mlbPos.z),
        target: qbPos,
      },
      {
        name: "Bird's Eye",
        // High above and slightly behind the QB, closer for better view
        position: new THREE.Vector3(qbPos.x - 5, 30, qbPos.z), 
        target: qbPos,
      }
    ]
  }

  // React to external view changes
  useEffect(() => {
    if (animationTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = animationTrigger
      
      const preset = getCameraPresets()[targetView];
      console.log(
        `%cVIEW CHANGE: ${preset.name} (Position: [${preset.position.toArray().join(', ')}], Target: [${preset.target.toArray().join(', ')}])`,
        'color: #00ff00; font-weight: bold;'
      );

      const controls = controlsRef.current
      if (controls) {
        controls.enabled = false
      }
      
      const currentPosition = camera.position.clone()
      const currentTarget = controlsRef.current && controlsRef.current.target.length() > 0.01
        ? controlsRef.current.target.clone()
        : getQBPosition()
      
      console.log('Animation Start:', { 
        position: `[${currentPosition.toArray().join(', ')}]`,
        target: `[${currentTarget.toArray().join(', ')}]`
      });

      animationRef.current = {
        startTime: performance.now() / 1000,
        toView: targetView,
        currentPosition,
        currentTarget
      }
    }
  }, [animationTrigger, camera, controlsRef, targetView])

  useFrame(() => {
    if (!isAnimating || !animationRef.current || animationRef.current.startTime === null) {
      return
    }

    const elapsed = performance.now() / 1000 - animationRef.current.startTime
    const duration = 1.2 // Animation duration in seconds
    const progress = Math.min(elapsed / duration, 1)

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
    const easedProgress = easeInOutCubic(progress)

    const fromPosition = animationRef.current.currentPosition!
    const fromTarget = animationRef.current.currentTarget!
    const toPreset = getCameraPresets()[animationRef.current.toView]

    const newPosition = fromPosition.clone().lerp(toPreset.position, easedProgress)
    const newTarget = fromTarget.clone().lerp(toPreset.target, easedProgress)

    camera.position.copy(newPosition)
    camera.lookAt(newTarget)

    if (progress >= 1) {
      camera.position.copy(toPreset.position)
      camera.lookAt(toPreset.target)

      console.log('Animation End:', { 
        position: `[${toPreset.position.toArray().join(', ')}]`,
        target: `[${toPreset.target.toArray().join(', ')}]`
      });

      const controls = controlsRef.current
      if (controls) {
        console.log('Handing controls back to user.');
        controls.target.copy(toPreset.target)
        controls.enabled = true
        controls.update()
      }

      animationRef.current = undefined
      onAnimationComplete()
    }
  })

  return null
}

export default function App() {
  const [currentView, setCurrentView] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const controlsRef = useRef<any>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)
  
  // Default to Chiefs vs Rams
  const [homeTeam, setHomeTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "KC")!)
  const [awayTeam, setAwayTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "LAR")!)

  const [controlsProps, setControlsProps] = useState({
    minPolarAngle: 0.1, // Prevent looking straight up into dome
    maxPolarAngle: Math.PI / 2 - 0.2, // More restrictive to maintain minimum height
    minAzimuthAngle: -Infinity, // Allow full 360 rotation
    maxAzimuthAngle: Infinity, // Allow full 360 rotation
  });

  const moveCameraToPosition = (positionIndex: number) => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentView(positionIndex)
      setAnimationTrigger(prev => prev + 1)
    }
  }

  const onAnimationComplete = () => {
    setIsAnimating(false)
    
    // Update controls properties after animation completes
    if (currentView === 3) { // Bird's Eye view
      setControlsProps({
        minPolarAngle: 0.1,
        maxPolarAngle: Math.PI / 2 - 0.2,
        minAzimuthAngle: -Infinity, // Allow full 360 rotation
        maxAzimuthAngle: Infinity, // Allow full 360 rotation
      });
    } else {
      setControlsProps({
        minPolarAngle: 0.2,
        maxPolarAngle: Math.PI / 2 - 0.25, // Even more restrictive for standard views
        minAzimuthAngle: -Infinity, // Allow full 360 rotation
        maxAzimuthAngle: Infinity, // Allow full 360 rotation
      });
    }
  }

  const captureSnapshot = () => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      // Get QB position
      const qbX = -5 * 0.9144 // YARD_TO_METER
      const qbZ = 0 * 0.9144
      
      const snapshot = {
        position: [
          camera.position.x.toFixed(2),
          camera.position.y.toFixed(2),
          camera.position.z.toFixed(2)
        ],
        target: [
          controls.target.x.toFixed(2),
          controls.target.y.toFixed(2),
          controls.target.z.toFixed(2)
        ],
        qb: [
          qbX.toFixed(2),
          1, // QB height
          qbZ.toFixed(2)
        ]
      }
      
      const snapshotString = `Camera Position: [${snapshot.position.join(', ')}], Target: [${snapshot.target.join(', ')}], QB Position: [${snapshot.qb.join(', ')}]`
      
      // Copy to clipboard
      navigator.clipboard.writeText(snapshotString).then(() => {
        console.log('Snapshot copied to clipboard:', snapshotString)
        alert('Camera coordinates copied to clipboard!')
      }).catch(err => {
        console.error('Failed to copy:', err)
        alert(`Camera coordinates: ${snapshotString}`)
      })
    }
  }

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      <Canvas
        camera={{
          position: [0, 25, 80],
          fov: 75,
        }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          cameraRef.current = camera
        }}
      >
        <fog attach="fog" args={['#1a1a1a', 50, 150]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 100, 0]} intensity={0.8} />
        <directionalLight position={[50, 50, 25]} intensity={0.3} />
        
        <NFLField homeTeam={homeTeam} awayTeam={awayTeam} />
        
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          maxDistance={80}
          minDistance={5}
          target={[0, 0, 0]}
          {...controlsProps}
        />
        
        <CameraController 
          targetView={currentView}
          animationTrigger={animationTrigger}
          onAnimationComplete={onAnimationComplete}
          controlsRef={controlsRef}
          isAnimating={isAnimating}
        />
      </Canvas>

      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
        padding: '16px', 
        zIndex: 9999,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => moveCameraToPosition(0)}
              disabled={isAnimating}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.5 : 1,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            >
              Sideline
            </button>
            <button
              onClick={() => moveCameraToPosition(1)}
              disabled={isAnimating}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.5 : 1,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            >
              Behind QB
            </button>
            <button
              onClick={() => moveCameraToPosition(2)}
              disabled={isAnimating}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.5 : 1,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            >
              Defense POV
            </button>
            <button
              onClick={() => moveCameraToPosition(3)}
              disabled={isAnimating}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.5 : 1,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            >
              Bird's Eye
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 8px' }} />
            <button
              onClick={captureSnapshot}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            >
              📸 Snapshot
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 8px' }} />
            
            {/* Team Selection */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: 'white', fontSize: '14px' }}>Home:</label>
                <select
                  value={homeTeam.abbreviation}
                  onChange={(e) => setHomeTeam(NFL_TEAMS.find(t => t.abbreviation === e.target.value)!)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {NFL_TEAMS.map(team => (
                    <option key={team.abbreviation} value={team.abbreviation}>
                      {team.city} {team.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: 'white', fontSize: '14px' }}>Away:</label>
                <select
                  value={awayTeam.abbreviation}
                  onChange={(e) => setAwayTeam(NFL_TEAMS.find(t => t.abbreviation === e.target.value)!)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {NFL_TEAMS.map(team => (
                    <option key={team.abbreviation} value={team.abbreviation}>
                      {team.city} {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
