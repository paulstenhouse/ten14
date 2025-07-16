import { Text } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useState, useRef } from 'react'
import { NFLTeam } from '../data/nflTeams'
import { PlayData } from '../types/playData'
import * as THREE from 'three'

interface PlayersFromDataProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  playData: PlayData
}

export default function PlayersFromData({ homeTeam, awayTeam, playData }: PlayersFromDataProps) {
  const { camera } = useThree()
  const [selectedPlayer, setSelectedPlayer] = useState<{team: 'offense' | 'defense', name: string} | null>(null)
  const [, forceUpdate] = useState({})
  const playerHeight = 1.8 // meters (about 6 feet)
  const playerRadius = 0.25 // meters
  
  // Force re-render when camera moves to update billboard text
  useFrame(() => {
    forceUpdate({})
  })
  
  // Function to get last name from full name
  const getLastName = (fullName: string) => {
    const parts = fullName.split(' ')
    return parts[parts.length - 1].toUpperCase()
  }
  
  // Function to get jersey number from name (could be extended with real data)
  const getJerseyNumber = (name: string, position: string): number | null => {
    // Map some known players to their numbers
    const knownNumbers: { [key: string]: number } = {
      'Patrick Mahomes': 15,
      'Cooper DeJean': 33,
      'Hollywood Brown': 17,
      'DeAndre Hopkins': 10,
      'Travis Kelce': 87,
      'Darius Slay': 2,
      'C.J. Gardner-Johnson': 8,
      'Reed Blankenship': 32,
      'Zack Baun': 53,
      'Noah Gray': 83,
      'Xavier Worthy': 1,
      'Samaje Perine': 34,
      'Quinyon Mitchell': 27,
      'Oren Burks': 42
    }
    return knownNumbers[name] || null
  }

  const renderPlayer = (player: any, teamColor: string, index: number, isOffense: boolean) => {
    const lastName = getLastName(player.name)
    const jerseyNumber = getJerseyNumber(player.name, player.position)
    
    // Calculate angle for billboard effect - text should always face camera
    // Player position in world: [player.z, 0, player.x] (swapped coordinates)
    const playerWorldPos = new THREE.Vector3(player.z, 0, player.x)
    const cameraWorldPos = camera.position.clone()
    // Calculate the angle from player to camera for proper billboard rotation
    const dx = cameraWorldPos.x - playerWorldPos.x
    const dz = cameraWorldPos.z - playerWorldPos.z
    const angle = Math.atan2(dx, dz)
    
    return (
      <group key={`player-${isOffense ? 'offense' : 'defense'}-${index}`} position={[player.z, 0, player.x]}>
        {/* Player cylinder */}
        <mesh 
          position={[0, playerHeight / 2, 0]} 
          castShadow
          onClick={(e) => {
            e.stopPropagation()
            const playerKey = `${isOffense ? 'offense' : 'defense'}-${player.name}`
            setSelectedPlayer(selectedPlayer?.team === (isOffense ? 'offense' : 'defense') && selectedPlayer?.name === player.name ? null : {team: isOffense ? 'offense' : 'defense', name: player.name})
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
        {selectedPlayer?.team === (isOffense ? 'offense' : 'defense') && selectedPlayer?.name === player.name && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[playerRadius + 0.1, playerRadius + 0.2, 32]} />
            <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Jersey number (billboard style - always facing camera) */}
        {jerseyNumber && (
          <Text
            position={[0, playerHeight + 0.3, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            rotation={[0, angle, 0]}
            fontWeight="bold"
          >
            {jerseyNumber}
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

        {/* Position code on top */}
        <Text
          position={[0, playerHeight + 0.1, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
          fontWeight="bold"
        >
          {player.position}
        </Text>
        
        {/* Highlight the interceptor */}
        {player.name === "Cooper DeJean" && (
          <mesh position={[0, playerHeight / 2, 0]}>
            <ringGeometry args={[playerRadius + 0.2, playerRadius + 0.3, 32]} />
            <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    )
  }

  return (
    <>
      {/* Render offense (Chiefs) */}
      {playData.offense_kc.map((player, index) => 
        renderPlayer(player, homeTeam.primaryColor, index, true)
      )}
      
      {/* Render defense (Eagles) */}
      {playData.defense_phi.map((player, index) => 
        renderPlayer(player, awayTeam.primaryColor, index, false)
      )}
      
      {/* Render the ball */}
      <mesh position={[playData.ball.z, 0.5, playData.ball.x]}>
        <sphereGeometry args={[0.15]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Add a glowing effect around the ball for visibility */}
      <mesh position={[playData.ball.z, 0.5, playData.ball.x]}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>
    </>
  )
}