import { Text } from '@react-three/drei'
import { YARD_TO_METER } from '../constants'
import { NFLTeam } from '../data/nflTeams'

interface Player {
  name: string
  number: number
  position: string
  x: number // yard position
  z: number // yard position
  team: 'home' | 'away'
}

interface PlayersProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
}

export default function Players({ homeTeam, awayTeam }: PlayersProps) {
  const players: Player[] = [
    // Home team offense (blue)
    { name: 'MAHOMES', number: 15, position: 'QB', x: -5, z: 0, team: 'home' },
    { name: 'KELCE', number: 87, position: 'TE', x: -7, z: 2, team: 'home' },
    { name: 'HILL', number: 10, position: 'WR', x: -7, z: 8, team: 'home' },
    { name: 'HUNT', number: 27, position: 'RB', x: -8, z: -1, team: 'home' },
    { name: 'BROWN', number: 77, position: 'LT', x: -7, z: -2, team: 'home' },
    { name: 'SMITH', number: 65, position: 'LG', x: -7, z: -1, team: 'home' },
    { name: 'CREED', number: 52, position: 'C', x: -7, z: 0, team: 'home' },
    { name: 'THUNEY', number: 62, position: 'RG', x: -7, z: 1, team: 'home' },
    { name: 'WYLIE', number: 76, position: 'RT', x: -7, z: 2, team: 'home' },
    { name: 'HARDMAN', number: 17, position: 'WR', x: -7, z: -8, team: 'home' },
    { name: 'VALDES', number: 84, position: 'WR', x: -7, z: 6, team: 'home' },

    // Away team defense (red)
    { name: 'DONALD', number: 99, position: 'DT', x: -2, z: 0, team: 'away' },
    { name: 'MILLER', number: 40, position: 'LB', x: 0, z: 0, team: 'away' },
    { name: 'RAMSEY', number: 5, position: 'CB', x: -2, z: 8, team: 'away' },
    { name: 'WAGNER', number: 54, position: 'LB', x: 2, z: -2, team: 'away' },
    { name: 'JACKSON', number: 20, position: 'S', x: 5, z: 0, team: 'away' },
    { name: 'WILLIAMS', number: 31, position: 'CB', x: -2, z: -8, team: 'away' },
    { name: 'FLOYD', number: 56, position: 'DE', x: -2, z: 3, team: 'away' },
    { name: 'JONES', number: 97, position: 'DE', x: -2, z: -3, team: 'away' },
    { name: 'ROBINSON', number: 23, position: 'S', x: 8, z: 0, team: 'away' },
    { name: 'JOHNSON', number: 43, position: 'LB', x: 2, z: 2, team: 'away' },
    { name: 'SCOTT', number: 25, position: 'CB', x: 0, z: 6, team: 'away' },
  ]

  const playerHeight = 2
  const playerRadius = 0.3
  const textHeight = 0.5

  return (
    <>
      {players.map((player, index) => {
        const xPos = player.x * YARD_TO_METER
        const zPos = player.z * YARD_TO_METER
        const teamColor = player.team === 'home' ? homeTeam.primaryColor : awayTeam.primaryColor
        const textColor = '#ffffff'

        return (
          <group key={`player-${index}`} position={[xPos, 0, zPos]}>
            {/* Player cylinder */}
            <mesh position={[0, playerHeight / 2, 0]} castShadow>
              <cylinderGeometry args={[playerRadius, playerRadius, playerHeight]} />
              <meshLambertMaterial color={teamColor} />
            </mesh>

            {/* Jersey number on back (visible from behind the line) */}
            <Text
              position={[-playerRadius - 0.01, playerHeight * 0.7, 0]}
              fontSize={0.3}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              rotation={[0, -Math.PI / 2, 0]}
            >
              {player.number}
            </Text>

            {/* Player name on back (visible from behind the line) */}
            <Text
              position={[-playerRadius - 0.01, playerHeight * 0.4, 0]}
              fontSize={0.15}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              rotation={[0, -Math.PI / 2, 0]}
            >
              {player.name}
            </Text>

            {/* Position code on top */}
            <Text
              position={[0, playerHeight + 0.1, 0]}
              fontSize={0.2}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {player.position}
            </Text>
          </group>
        )
      })}
    </>
  )
}