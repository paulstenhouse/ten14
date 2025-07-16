import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import NFLField from "./NFLField"
import PlayTimeline from "./PlayTimeline"
import { NFL_TEAMS, NFLTeam } from "../data/nflTeams"
import { deJeanInterceptionData } from "../types/playData"
import { deJeanInterceptionPlay, convertToAnimationFrames, createPlayerInfo } from "../types/newPlayData"

// Helper functions for camera positioning
const getQBPositionFromFrames = (animationFrames: any) => {
  // Get QB position from animation data
  if (animationFrames && animationFrames.length > 0) {
    const frame = animationFrames[0] // Use first frame for initial position
    const qb = frame.offense_kc.find(p => p.id === 1) // Mahomes is id 1
    if (qb) {
      return new THREE.Vector3(qb.pos[1], 1, qb.pos[0]) // Swap coordinates
    }
  }
  // Fallback position
  return new THREE.Vector3(28, 1, -1)
}

const getMLBPositionFromFrames = (animationFrames: any) => {
  // Get middle linebacker position from animation data
  if (animationFrames && animationFrames.length > 0) {
    const frame = animationFrames[0]
    const mlb = frame.defense_phi.find(p => p.id === 31 || p.id === 32) // LBs
    if (mlb) {
      return new THREE.Vector3(mlb.pos[1], 1.5, mlb.pos[0]) // Swap coordinates
    }
  }
  // Fallback position
  return new THREE.Vector3(20, 1.5, 0)
}

const getCameraPresetsFromFrames = (animationFrames: any) => {
  const qbPos = getQBPositionFromFrames(animationFrames)
  const mlbPos = getMLBPositionFromFrames(animationFrames)
  
  // In the coordinate system:
  // - Positive z points toward Eagles endzone
  // - Chiefs (offense) start at z≈28 (in their own territory)  
  // - Eagles (defense) are at z≈15-20
  // - So Chiefs are facing negative z (toward Eagles endzone which is at negative z)
  const offenseFacingNegativeZ = true

  return [
    {
      name: "Sideline View",
      position: new THREE.Vector3(qbPos.x, 20, qbPos.z + 35),
      target: qbPos,
    },
    {
      name: "Behind QB",
      // Camera should be behind QB based on which way they're facing
      position: new THREE.Vector3(
        qbPos.x + (offenseFacingNegativeZ ? 15 : -15), 
        8, 
        qbPos.z
      ),
      target: new THREE.Vector3(
        qbPos.x - (offenseFacingNegativeZ ? 5 : -5),
        qbPos.y,
        qbPos.z
      ),
    },
    {
      name: "Defense POV",
      // Camera should be behind defense looking at offense
      position: new THREE.Vector3(
        mlbPos.x - (offenseFacingNegativeZ ? 15 : -15), 
        mlbPos.y + 10, 
        mlbPos.z
      ),
      target: qbPos,
    },
    {
      name: "Bird's Eye",
      // Position camera above field from same side as sideline view
      position: new THREE.Vector3(
        qbPos.x, 
        50, 
        qbPos.z + 15 // Positioned on same side as sideline view
      ), 
      target: new THREE.Vector3(
        qbPos.x,
        0,
        qbPos.z - 5 // Look slightly ahead of QB
      ),
    }
  ]
}

// Camera animation component (copied from App.tsx)
function CameraController({ 
  targetView, 
  animationTrigger, 
  onAnimationComplete, 
  controlsRef,
  isAnimating,
  animationFrames,
  currentFrameIndex,
  playData
}: { 
  targetView: number; 
  animationTrigger: number; 
  onAnimationComplete: () => void; 
  controlsRef: any;
  isAnimating: boolean;
  animationFrames?: any;
  currentFrameIndex?: number;
  playData?: any;
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
    // Get QB position from animation data or static data
    if (animationFrames && currentFrameIndex >= 0) {
      const frame = animationFrames[currentFrameIndex]
      const qb = frame.offense_kc.find(p => p.id === 1) // Mahomes is id 1
      if (qb) {
        return new THREE.Vector3(qb.pos[1], 1, qb.pos[0]) // Swap coordinates
      }
    } else if (playData) {
      const qb = playData.offense_kc.find(p => p.position === 'QB')
      if (qb) {
        return new THREE.Vector3(qb.z, 1, qb.x) // Swap coordinates
      }
    }
    // Fallback position
    return new THREE.Vector3(28, 1, -1)
  }

  const getMLBPosition = () => {
    // Get middle linebacker position from animation data
    if (animationFrames && currentFrameIndex >= 0) {
      const frame = animationFrames[currentFrameIndex]
      const mlb = frame.defense_phi.find(p => p.id === 31 || p.id === 32) // LBs
      if (mlb) {
        return new THREE.Vector3(mlb.pos[1], 1.5, mlb.pos[0]) // Swap coordinates
      }
    } else if (playData) {
      const mlb = playData.defense_phi.find(p => p.position === 'LB')
      if (mlb) {
        return new THREE.Vector3(mlb.z, 1.5, mlb.x) // Swap coordinates
      }
    }
    // Fallback position
    return new THREE.Vector3(20, 1.5, 0)
  }


  const getCameraPresets = () => {
    const qbPos = getQBPosition()
    const mlbPos = getMLBPosition()
    
    // In the coordinate system:
    // - Positive z points toward Eagles endzone
    // - Chiefs (offense) start at z≈28 (in their own territory)  
    // - Eagles (defense) are at z≈15-20
    // - So Chiefs are facing negative z (toward Eagles endzone which is at negative z)
    const offenseFacingNegativeZ = true

    return [
      {
        name: "Sideline View",
        position: new THREE.Vector3(qbPos.x, 20, qbPos.z + 35),
        target: qbPos,
      },
      {
        name: "Behind QB",
        // Camera should be behind QB based on which way they're facing
        position: new THREE.Vector3(
          qbPos.x + (offenseFacingNegativeZ ? 15 : -15), 
          8, 
          qbPos.z
        ),
        target: new THREE.Vector3(
          qbPos.x - (offenseFacingNegativeZ ? 5 : -5),
          qbPos.y,
          qbPos.z
        ),
      },
      {
        name: "Defense POV",
        // Camera should be behind defense looking at offense
        position: new THREE.Vector3(
          mlbPos.x - (offenseFacingNegativeZ ? 15 : -15), 
          mlbPos.y + 10, 
          mlbPos.z
        ),
        target: qbPos,
      },
      {
        name: "Bird's Eye",
        // Position camera above field from same side as sideline view
        position: new THREE.Vector3(
          qbPos.x, 
          50, 
          qbPos.z + 15 // Positioned on same side as sideline view
        ), 
        target: new THREE.Vector3(
          qbPos.x,
          0,
          qbPos.z - 5 // Look slightly ahead of QB
        ),
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
    const toView = animationRef.current.toView
    const toPosition = getCameraPresets()[toView].position
    
    // Check if we need a sideline swing:
    // 1. When crossing from one side to the other (x-axis)
    // 2. When switching between Behind QB (1) and Defense POV (2)
    const isQBToDefense = (fromView === 1 && toView === 2) || (fromView === 2 && toView === 1)
    const crossingXAxis = (fromPosition.x < -5 && toPosition.x > 5) || 
                         (fromPosition.x > 5 && toPosition.x < -5)
    const needsSidelineSwing = isQBToDefense || crossingXAxis
    
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

interface FieldViewerProps {
  onPlayDescriptionChange?: (description: string) => void
}

export default function FieldViewer({ onPlayDescriptionChange }: FieldViewerProps = {}) {
  const [currentView, setCurrentView] = useState(1) // Start with "Behind QB" view (index 1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [initialCameraSet, setInitialCameraSet] = useState(false)
  const controlsRef = useRef<any>(null)
  
  const [homeTeam, setHomeTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "KC")!)
  const [awayTeam, setAwayTeam] = useState<NFLTeam>(NFL_TEAMS.find(t => t.abbreviation === "PHI")!)
  const showRealPlay = true // Always show DeJean INT data
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false)
  const [animationMode, setAnimationMode] = useState(true) // Always start in animation mode
  const [currentAnimationFrame, setCurrentAnimationFrame] = useState(0)
  const [currentAnimationTime, setCurrentAnimationTime] = useState(0)
  const [seekTime, setSeekTime] = useState<number | null>(0) // Start at first frame
  const [showOpenSpace, setShowOpenSpace] = useState(false)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set())
  const [showAllTracks, setShowAllTracks] = useState(false)
  
  // Convert new format to old format for compatibility
  const animationFrames = convertToAnimationFrames(deJeanInterceptionPlay)
  
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
  
  const handlePlayAnimation = () => {
    // If at end and pressing play, reset and start playing
    if (isAtEnd && !isPlayingAnimation) {
      // Immediately reset the time to clear the timeline
      setCurrentAnimationTime(0)
      setCurrentAnimationFrame(0)
      setIsAtEnd(false)
      // Set seekTime to 0 to trigger reset in PlayersAnimated
      setSeekTime(0)
      // Use double requestAnimationFrame to ensure state updates are processed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSeekTime(null)
          setIsPlayingAnimation(true)
        })
      })
    } else {
      setIsPlayingAnimation(!isPlayingAnimation)
      setSeekTime(null)
    }
    
    if (!animationMode) {
      setAnimationMode(true)
    }
  }
  
  const handleResetAnimation = () => {
    setIsPlayingAnimation(false)
    setAnimationMode(true) // Keep animation mode active
    setCurrentAnimationFrame(0)
    setCurrentAnimationTime(0)
    setSeekTime(0)
    setIsAtEnd(false)
  }
  
  const onPlayAnimationComplete = () => {
    setIsPlayingAnimation(false)
    setIsAtEnd(true)
  }
  
  const onAnimationFrameChange = (frameIndex: number) => {
    setCurrentAnimationFrame(frameIndex)
    // Check if we're at the last frame
    if (frameIndex >= animationFrames.length - 1) {
      setIsAtEnd(true)
    } else {
      setIsAtEnd(false)
    }
    
    // Update play description
    if (onPlayDescriptionChange) {
      const currentPlay = deJeanInterceptionPlay.plays.find((play, index) => {
        const nextPlay = deJeanInterceptionPlay.plays[index + 1]
        if (!nextPlay) return frameIndex >= animationFrames.length - 1
        const currentTime = animationFrames[frameIndex].frame_time_seconds
        return currentTime >= play.time && currentTime < nextPlay.time
      })
      
      if (currentPlay?.description) {
        onPlayDescriptionChange(currentPlay.description)
      } else if (frameIndex === 0 && deJeanInterceptionPlay.summary_of_play) {
        onPlayDescriptionChange(deJeanInterceptionPlay.summary_of_play)
      }
    }
  }
  
  const onAnimationTimeChange = (time: number) => {
    setCurrentAnimationTime(time)
  }
  
  const handleTimelineSelect = (time: number) => {
    setSeekTime(time)
    setCurrentAnimationTime(time)
    setIsAtEnd(false) // Clear the end state when seeking
    // Don't auto-play when seeking
    if (!isPlayingAnimation) {
      setAnimationMode(true)
    }
  }
  
  const handleToggleAllTracks = () => {
    if (showAllTracks || selectedPlayers.size > 0) {
      // Turn all tracks off
      setSelectedPlayers(new Set())
      setShowAllTracks(false)
    } else {
      // Turn all tracks on
      const allPlayerIds = new Set<string>()
      if (animationFrames.length > 0) {
        const frame = animationFrames[0]
        frame.offense_kc.forEach(player => allPlayerIds.add(`offense_kc-${player.id}`))
        frame.defense_phi.forEach(player => allPlayerIds.add(`defense_phi-${player.id}`))
      }
      setSelectedPlayers(allPlayerIds)
      setShowAllTracks(true)
    }
  }

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 relative">
      <Canvas
        camera={{
          position: [0, 8, 0], // Initial position, will be updated
          fov: 75,
        }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          // Set initial camera to Behind QB view after canvas is created
          if (!initialCameraSet) {
            const presets = getCameraPresetsFromFrames(animationFrames)
            const qbPos = presets[1].position
            const targetPos = presets[1].target
            camera.position.copy(qbPos)
            camera.lookAt(targetPos)
            if (controlsRef.current) {
              controlsRef.current.target.copy(targetPos)
              controlsRef.current.update()
            }
            setInitialCameraSet(true)
          }
        }}
      >
        <fog attach="fog" args={[isDarkMode ? '#18181b' : '#f5f5f5', 100, 250]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 100, 0]} intensity={0.8} />
        <directionalLight position={[50, 50, 25]} intensity={0.3} />
        
        <NFLField 
          homeTeam={homeTeam} 
          awayTeam={awayTeam} 
          playData={showRealPlay && !animationMode ? deJeanInterceptionData : undefined}
          animationFrames={showRealPlay && animationMode ? animationFrames : undefined}
          isAnimating={isPlayingAnimation}
          onAnimationComplete={onPlayAnimationComplete}
          onFrameChange={onAnimationFrameChange}
          onTimeChange={onAnimationTimeChange}
          seekTime={seekTime}
          showOpenSpace={showOpenSpace}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />
        
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
          animationFrames={showRealPlay && animationMode ? animationFrames : undefined}
          currentFrameIndex={currentAnimationFrame}
          playData={showRealPlay && !animationMode ? deJeanInterceptionData : undefined}
        />
      </Canvas>

      {/* Timeline - always visible */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <PlayTimeline
          frames={animationFrames}
          currentTime={currentAnimationTime}
          isPlaying={isPlayingAnimation}
          isAtEnd={isAtEnd}
          onTimeSelect={handleTimelineSelect}
          onPlayPause={handlePlayAnimation}
          onReset={handleResetAnimation}
        />
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm p-3 border-t border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Camera buttons */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase text-muted-foreground mb-1">Camera Controls</span>
            <div className="flex gap-1.5">
            {['Sideline', 'Behind QB', 'Defense POV', 'Bird\'s Eye'].map((view, index) => {
              // Direct index mapping since buttons are now in same order as camera presets
              return (
                <button
                key={view}
                onClick={() => moveCameraToPosition(index)}
                disabled={isAnimating}
                className={`px-3 py-1.5 bg-secondary text-secondary-foreground border-0 rounded text-xs font-medium transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {view}
              </button>
              )
            })}
            </div>
          </div>
          
          {/* Open Space toggle */}
          {showRealPlay && animationMode && (
            <>
              <div className="w-px h-5 bg-border" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase text-muted-foreground mb-1">Layers</span>
                <div className="flex gap-1.5">
                  <button
                onClick={() => setShowOpenSpace(!showOpenSpace)}
                className={`px-3 py-1.5 border-0 rounded text-xs font-medium transition-colors ${
                  showOpenSpace 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Open Space
                  </button>
                  <button
                    onClick={handleToggleAllTracks}
                    className={`px-3 py-1.5 border-0 rounded text-xs font-medium transition-colors ${
                      showAllTracks || selectedPlayers.size > 0
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Player Tracks
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}