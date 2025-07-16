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
    
    // Check if we're switching between offensive and defensive views for smoother animation
    const fromPosition = animationRef.current.currentPosition!
    const fromView = getCameraPresets().findIndex(preset => 
      preset.position.distanceTo(fromPosition) < 1
    )
    // Check if camera is crossing from one side of the field to the other (crossing x=0)
    const toPosition = getCameraPresets()[animationRef.current.toView].position
    const needsSidelineSwing = (fromPosition.x < 0 && toPosition.x > 0) || 
                              (fromPosition.x > 0 && toPosition.x < 0)
    
    // Use longer duration for sideline swing transitions
    const duration = needsSidelineSwing ? 1.8 : 1.2
    const progress = Math.min(elapsed / duration, 1)

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
    const easedProgress = easeInOutCubic(progress)

    const fromTarget = animationRef.current.currentTarget!
    const toPreset = getCameraPresets()[animationRef.current.toView]

    let newPosition: THREE.Vector3
    let newTarget: THREE.Vector3

    if (needsSidelineSwing) {
      // Create a smooth bezier curve path around the sideline without zooming out
      const avgHeight = (fromPosition.y + toPreset.position.y) / 2
      const midPoint1 = new THREE.Vector3(
        fromPosition.x * 0.7,
        avgHeight, // Keep same height
        25 // Closer to the sideline
      )
      const midPoint2 = new THREE.Vector3(
        toPreset.position.x * 0.7,
        avgHeight, // Keep same height
        25 // Stay close to the sideline
      )
      
      // Calculate bezier curve position
      const t = easedProgress
      const t2 = t * t
      const t3 = t2 * t
      const mt = 1 - t
      const mt2 = mt * mt
      const mt3 = mt2 * mt
      
      // Cubic bezier curve: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
      newPosition = new THREE.Vector3()
        .addScaledVector(fromPosition, mt3)
        .addScaledVector(midPoint1, 3 * mt2 * t)
        .addScaledVector(midPoint2, 3 * mt * t2)
        .addScaledVector(toPreset.position, t3)
      
      // Smooth target interpolation
      newTarget = fromTarget.clone().lerp(toPreset.target, easedProgress)
    } else {
      // Normal linear interpolation for other transitions
      newPosition = fromPosition.clone().lerp(toPreset.position, easedProgress)
      newTarget = fromTarget.clone().lerp(toPreset.target, easedProgress)
    }

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
    <div className="w-full h-full bg-white dark:bg-zinc-900 relative">
      <Canvas
        camera={{
          position: [-4.5 * 0.9144 - 15, 8, 0], // Behind QB position
          fov: 75,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={[isDarkMode ? '#18181b' : '#f5f5f5', 100, 250]} />
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
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm p-3 border-t border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Camera buttons */}
          <div className="flex gap-1.5">
            {['Sideline', 'Behind QB', 'Bird\'s Eye', 'Defense POV'].map((view, index) => {
              const viewIndex = view === 'Bird\'s Eye' ? 3 : view === 'Defense POV' ? 2 : ['Sideline', 'Behind QB'].indexOf(view);
              return (
                <button
                key={view}
                onClick={() => moveCameraToPosition(viewIndex)}
                disabled={isAnimating}
                className={`px-3 py-1.5 bg-secondary text-secondary-foreground border-0 rounded text-xs font-medium transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {view}
              </button>
              )
            })}
          </div>
          
          <div className="w-px h-5 bg-border" />
          
          {/* Team selection */}
          <div className="flex gap-2 items-center">
            <select
              value={homeTeam.abbreviation}
              onChange={(e) => setHomeTeam(NFL_TEAMS.find(t => t.abbreviation === e.target.value)!)}
              className="px-2 py-1 bg-secondary text-secondary-foreground border-0 rounded text-xs"
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
              className="px-2 py-1 bg-secondary text-secondary-foreground border-0 rounded text-xs"
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