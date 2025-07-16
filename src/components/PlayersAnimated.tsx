import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Text, Line } from '@react-three/drei'
import { NFLTeam } from '../data/nflTeams'
import { AnimationFrame } from '../types/playData'
import { deJeanInterceptionPlay, createPlayerInfo } from '../types/newPlayData'
import OpenSpaceOverlay from './OpenSpaceOverlay'
import * as THREE from 'three'

interface PlayersAnimatedProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  animationFrames: AnimationFrame[]
  isPlaying: boolean
  onPlayComplete?: () => void
  onFrameChange?: (frameIndex: number) => void
  onTimeChange?: (time: number) => void
  playbackSpeed?: number
  seekTime?: number | null
  showOpenSpace?: boolean
}

export default function PlayersAnimated({ 
  homeTeam, 
  awayTeam, 
  animationFrames, 
  isPlaying,
  onPlayComplete,
  onFrameChange,
  onTimeChange,
  playbackSpeed = 1,
  seekTime,
  showOpenSpace = false
}: PlayersAnimatedProps) {
  const { camera } = useThree()
  
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [interpolationProgress, setInterpolationProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set())
  const [, forceUpdate] = useState({})
  const elapsedTimeRef = useRef(0)
  const playerHeight = 1.8
  const playerRadius = 0.25
  
  // Get player info from new format
  const playerInfo = createPlayerInfo(deJeanInterceptionPlay)
  
  // Check if a player is an eligible receiver
  const isEligibleReceiver = (playerId: number, team: 'offense_kc' | 'defense_phi') => {
    // Only offensive players can be receivers
    if (team !== 'offense_kc') return false
    
    const player = playerInfo.offense_kc[playerId]
    if (!player) return false
    
    // Eligible positions: WR, TE, RB
    const eligiblePositions = ['WR', 'TE', 'RB']
    return eligiblePositions.includes(player.position)
  }
  
  // Handle seeking to specific times
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && seekTime === 0) {
      // Reset to start when explicitly seeking to 0
      setCurrentFrameIndex(0)
      setInterpolationProgress(0)
      setElapsedTime(0)
      elapsedTimeRef.current = 0
      onFrameChange?.(0)
      onTimeChange?.(0) // Also notify parent of time reset
    }
  }, [seekTime, onFrameChange, onTimeChange])
  
  // Handle seeking to specific time
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined) {
      // Find the appropriate frame
      let frameIndex = 0
      for (let i = 0; i < animationFrames.length - 1; i++) {
        if (seekTime >= animationFrames[i].frame_time_seconds && 
            seekTime < animationFrames[i + 1].frame_time_seconds) {
          frameIndex = i
          break
        }
      }
      if (seekTime >= animationFrames[animationFrames.length - 1].frame_time_seconds) {
        frameIndex = animationFrames.length - 1
      }
      
      setCurrentFrameIndex(frameIndex)
      setElapsedTime(seekTime)
      elapsedTimeRef.current = seekTime
      onFrameChange?.(frameIndex)
      
      // Calculate interpolation progress
      if (frameIndex < animationFrames.length - 1) {
        const currentFrame = animationFrames[frameIndex]
        const nextFrame = animationFrames[frameIndex + 1]
        const frameDuration = nextFrame.frame_time_seconds - currentFrame.frame_time_seconds
        const progress = (seekTime - currentFrame.frame_time_seconds) / frameDuration
        setInterpolationProgress(Math.max(0, Math.min(1, progress)))
      } else {
        setInterpolationProgress(0)
      }
      onTimeChange?.(seekTime)
    }
  }, [seekTime, animationFrames, onFrameChange, onTimeChange])

  useFrame((state, delta) => {
    // Force re-render for billboard text updates
    forceUpdate({})
    
    if (!isPlaying) return
    
    // Check if we're at the last frame
    if (currentFrameIndex >= animationFrames.length - 1) {
      // Stay on the last frame instead of resetting
      setCurrentFrameIndex(animationFrames.length - 1)
      setInterpolationProgress(0)
      onPlayComplete?.()
      return
    }
    
    elapsedTimeRef.current += delta * playbackSpeed
    setElapsedTime(elapsedTimeRef.current)
    onTimeChange?.(elapsedTimeRef.current)
    
    const currentFrame = animationFrames[currentFrameIndex]
    const nextFrame = animationFrames[currentFrameIndex + 1]
    
    if (!nextFrame) {
      onPlayComplete?.()
      return
    }
    
    const frameDuration = nextFrame.frame_time_seconds - currentFrame.frame_time_seconds
    const frameProgress = (elapsedTimeRef.current - currentFrame.frame_time_seconds) / frameDuration
    
    if (frameProgress >= 1) {
      const newIndex = currentFrameIndex + 1
      setCurrentFrameIndex(newIndex)
      setInterpolationProgress(0)
      onFrameChange?.(newIndex)
    } else {
      setInterpolationProgress(frameProgress)
    }
  })
  
  const currentFrame = animationFrames[currentFrameIndex]
  const nextFrame = animationFrames[Math.min(currentFrameIndex + 1, animationFrames.length - 1)]
  
  // Get open space data for current frame
  const getOpenSpaceForPlayer = (playerId: number, team: 'offense_kc' | 'defense_phi') => {
    // Use the frame index, but ensure it's within bounds
    const frameIndex = Math.min(currentFrameIndex, deJeanInterceptionPlay.plays.length - 1)
    const currentPlayFrame = deJeanInterceptionPlay.plays[frameIndex]
    
    if (!currentPlayFrame) return 5 // Default value
    
    const openSpaceData = team === 'offense_kc' 
      ? currentPlayFrame.open_space_offense 
      : currentPlayFrame.open_space_defense
      
    // Return the actual value or a default of 5
    const value = openSpaceData?.[playerId.toString()]
    return value !== undefined ? value : 5
  }
  
  const getInterpolatedPosition = (current: [number, number], next: [number, number], progress: number) => {
    return {
      x: current[0] + (next[0] - current[0]) * progress,
      z: current[1] + (next[1] - current[1]) * progress
    }
  }
  
  const getLastName = (fullName: string) => {
    const parts = fullName.split(' ')
    return parts[parts.length - 1].toUpperCase()
  }
  
  const renderPlayer = (
    playerId: number, 
    currentPos: [number, number], 
    nextPos: [number, number], 
    teamColor: string, 
    isOffense: boolean,
    team: 'offense_kc' | 'defense_phi'
  ) => {
    const info = playerInfo[team][playerId]
    if (!info) return null
    
    const position = getInterpolatedPosition(currentPos, nextPos, interpolationProgress)
    const lastName = getLastName(info.name)
    
    // Calculate angle for billboard effect - text should always face camera
    // Player position in world: [position.z, 0, position.x] (swapped coordinates)
    const playerWorldPos = new THREE.Vector3(position.z, 0, position.x)
    const cameraWorldPos = camera.position.clone()
    // Calculate the angle from player to camera for proper billboard rotation
    const dx = cameraWorldPos.x - playerWorldPos.x
    const dz = cameraWorldPos.z - playerWorldPos.z
    const angle = Math.atan2(dx, dz)
    
    // Highlight DeJean when near the ball (within 2 meters)
    const isDeJean = info.name === "Cooper DeJean"
    const ballPos = getInterpolatedPosition(
      [currentFrame.ball.x, currentFrame.ball.z],
      [nextFrame.ball.x, nextFrame.ball.z],
      interpolationProgress
    )
    const distanceToBall = Math.sqrt(
      Math.pow(position.x - ballPos.x, 2) + Math.pow(position.z - ballPos.z, 2)
    )
    const isNearBall = isDeJean && distanceToBall < 2
    
    return (
      <group key={`${team}-${playerId}`} position={[position.z, 0, position.x]}>
        {/* Player cylinder */}
        <mesh 
          position={[0, playerHeight / 2, 0]} 
          castShadow
          onClick={(e) => {
            e.stopPropagation()
            const playerKey = `${team}-${playerId}`
            setSelectedPlayers(prev => {
              const newSet = new Set(prev)
              if (newSet.has(playerKey)) {
                newSet.delete(playerKey)
              } else {
                newSet.add(playerKey)
              }
              return newSet
            })
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <cylinderGeometry args={[playerRadius, playerRadius, playerHeight]} />
          <meshLambertMaterial color={teamColor} />
        </mesh>

        {/* Selection ring */}
        {selectedPlayers.has(`${team}-${playerId}`) && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[playerRadius + 0.1, playerRadius + 0.2, 32]} />
            <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Jersey number (billboard style - always facing camera) */}
        {info.number && (
          <Text
            position={[0, playerHeight + 0.3, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            rotation={[0, angle, 0]}
            fontWeight="bold"
          >
            {info.number}
          </Text>
        )}

        {/* Player name (billboard style - always facing camera) */}
        <Text
          position={[0, playerHeight + 0.6, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, angle, 0]}
        >
          {lastName}
        </Text>

        {/* Position on top */}
        <Text
          position={[0, playerHeight + 0.1, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
          fontWeight="bold"
        >
          {info.position}
        </Text>
        
        {/* Highlight ring for DeJean when near ball */}
        {isNearBall && (
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[playerRadius + 0.3, playerRadius + 0.4, 32]} />
            <meshBasicMaterial color="#FF6B6B" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    )
  }

  // Get paths for all selected players
  const getPlayerPaths = () => {
    const paths: { key: string, points: THREE.Vector3[] }[] = []
    
    selectedPlayers.forEach(playerKey => {
      const [team, id] = playerKey.split('-')
      const playerId = parseInt(id)
      const teamKey = team as 'offense_kc' | 'defense_phi'
      
      const path: THREE.Vector3[] = []
      for (const frame of animationFrames) {
        const player = frame[teamKey].find(p => p.id === playerId)
        if (player) {
          // Convert to world coordinates (swap x and z)
          path.push(new THREE.Vector3(player.pos[1], 0.1, player.pos[0]))
        }
      }
      
      if (path.length > 0) {
        paths.push({ key: playerKey, points: path })
      }
    })
    
    return paths
  }

  // Interpolate ball position
  const ballPosition = getInterpolatedPosition(
    [currentFrame.ball.x, currentFrame.ball.z],
    [nextFrame.ball.x, nextFrame.ball.z],
    interpolationProgress
  )

  return (
    <>
      {/* Render paths for all selected players */}
      {getPlayerPaths().map(({ key, points }) => (
        <Line
          key={`path-${key}`}
          points={points}
          color="#FFD700"
          lineWidth={3}
          dashed={false}
        />
      ))}
      
      {/* Render offense */}
      {currentFrame.offense_kc.map((player, index) => {
        const nextPlayer = nextFrame.offense_kc.find(p => p.id === player.id)
        if (!nextPlayer) return null
        return renderPlayer(
          player.id,
          player.pos,
          nextPlayer.pos,
          homeTeam.primaryColor,
          true,
          'offense_kc'
        )
      })}
      
      {/* Render defense */}
      {currentFrame.defense_phi.map((player, index) => {
        const nextPlayer = nextFrame.defense_phi.find(p => p.id === player.id)
        if (!nextPlayer) return null
        return renderPlayer(
          player.id,
          player.pos,
          nextPlayer.pos,
          awayTeam.primaryColor,
          false,
          'defense_phi'
        )
      })}
      
      {/* Render the ball */}
      <group position={[ballPosition.z, 0, ballPosition.x]}>
        {/* Football */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        
        {/* Ball trail effect */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
        </mesh>
        
        {/* Ground marker */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} opacity={0.5} transparent />
        </mesh>
      </group>
      
      {/* Open space overlays - rendered separately so they don't replace players */}
      {showOpenSpace && (
        <>
          {/* Offense open space - only for eligible receivers */}
          {currentFrame.offense_kc.map((player) => {
            // Only show for eligible receivers
            if (!isEligibleReceiver(player.id, 'offense_kc')) return null
            
            const nextPlayer = nextFrame.offense_kc.find(p => p.id === player.id)
            if (!nextPlayer) return null
            const position = getInterpolatedPosition(player.pos, nextPlayer.pos, interpolationProgress)
            const openSpace = getOpenSpaceForPlayer(player.id, 'offense_kc')
            
            return (
              <OpenSpaceOverlay
                key={`os-o-${player.id}`}
                playerId={player.id.toString()}
                position={[position.z, position.x]}
                openSpace={openSpace}
                isOffense={true}
                showOverlay={true}
              />
            )
          })}
          
          {/* Defense open space - removed since defenders don't receive passes */}
        </>
      )}
    </>
  )
}