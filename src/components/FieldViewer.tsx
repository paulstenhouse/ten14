import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import NFLField from "./NFLField"
import { NFL_TEAMS, NFLTeam } from "../data/nflTeams"

// Camera animation component (copied from App.tsx)
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

  const getQBPosition = () => {
    const qbX = -5 * 0.9144
    const qbZ = 0 * 0.9144
    return new THREE.Vector3(qbX, 1, qbZ)
  }

  const getMLBPosition = () => {
    const mlbX = 0 * 0.9144
    const mlbZ = 0 * 0.9144
    return new THREE.Vector3(mlbX, 1.5, mlbZ)
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
        position: new THREE.Vector3(qbPos.x - 5, 30, qbPos.z), 
        target: qbPos,
      }
    ]
  }

  useEffect(() => {
    if (animationTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = animationTrigger
      
      const preset = getCameraPresets()[targetView];
      const controls = controlsRef.current
      if (controls) {
        controls.enabled = false
      }
      
      const currentPosition = camera.position.clone()
      const currentTarget = controlsRef.current && controlsRef.current.target.length() > 0.01
        ? controlsRef.current.target.clone()
        : getQBPosition()

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
    const duration = 1.2
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

      const controls = controlsRef.current
      if (controls) {
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

export default function FieldViewer() {
  const [currentView, setCurrentView] = useState(1) // Start with "Behind QB" view (index 1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const controlsRef = useRef<any>(null)
  
  const [homeTeam, setHomeTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "KC")!)
  const [awayTeam, setAwayTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "LAR")!)

  const [controlsProps, setControlsProps] = useState({
    minPolarAngle: 0.1,
    maxPolarAngle: Math.PI / 2 - 0.2,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
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
    
    if (currentView === 3) {
      setControlsProps({
        minPolarAngle: 0.1,
        maxPolarAngle: Math.PI / 2 - 0.2,
        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,
      });
    } else {
      setControlsProps({
        minPolarAngle: 0.2,
        maxPolarAngle: Math.PI / 2 - 0.25,
        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,
      });
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a', position: 'relative' }}>
      <Canvas
        camera={{
          position: [-4.5 * 0.9144 - 15, 8, 0], // Behind QB position
          fov: 75,
        }}
        style={{ width: '100%', height: '100%' }}
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

      {/* Controls overlay */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        padding: '12px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Camera buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Sideline', 'Behind QB', 'Defense POV', 'Bird\'s Eye'].map((view, index) => (
              <button
                key={view}
                onClick={() => moveCameraToPosition(index)}
                disabled={isAnimating}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.5 : 1,
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                {view}
              </button>
            ))}
          </div>
          
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          
          {/* Team selection */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={homeTeam.abbreviation}
              onChange={(e) => setHomeTeam(NFL_TEAMS.find(t => t.abbreviation === e.target.value)!)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {NFL_TEAMS.map(team => (
                <option key={team.abbreviation} value={team.abbreviation}>
                  {team.abbreviation}
                </option>
              ))}
            </select>
            <span style={{ color: '#888', fontSize: '12px' }}>vs</span>
            <select
              value={awayTeam.abbreviation}
              onChange={(e) => setAwayTeam(NFL_TEAMS.find(t => t.abbreviation === e.target.value)!)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {NFL_TEAMS.map(team => (
                <option key={team.abbreviation} value={team.abbreviation}>
                  {team.abbreviation}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}