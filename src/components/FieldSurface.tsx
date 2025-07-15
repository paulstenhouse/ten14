import { FIELD_LENGTH, FIELD_WIDTH, YARD_TO_METER, FIELD_GREEN, END_ZONE_DEPTH } from '../constants'
import { Text } from '@react-three/drei'
import { NFLTeam } from '../data/nflTeams'

interface FieldSurfaceProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
}

export default function FieldSurface({ homeTeam, awayTeam }: FieldSurfaceProps) {
  const surfaces = []
  const stripeWidth = 10 * YARD_TO_METER // 10 yard stripes
  const darkGreen = "#1e3a1e"
  const lightGreen = "#2d5a2d"
  
  // Create alternating stripes for the main field (100 yards)
  const playingFieldStart = -50 * YARD_TO_METER
  for (let i = 0; i < 10; i++) {
    const xPos = playingFieldStart + (i * stripeWidth) + stripeWidth / 2
    const color = i % 2 === 0 ? darkGreen : lightGreen
    
    surfaces.push(
      <mesh key={`stripe-${i}`} position={[xPos, 0, 0]} receiveShadow>
        <boxGeometry args={[stripeWidth, 0.1, FIELD_WIDTH * YARD_TO_METER]} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }
  
  // End zones (team colors)
  const endZoneWidth = END_ZONE_DEPTH * YARD_TO_METER
  
  // Home team end zone (left)
  surfaces.push(
    <mesh key="endzone-left" position={[-(50 + END_ZONE_DEPTH / 2) * YARD_TO_METER, 0, 0]} receiveShadow>
      <boxGeometry args={[endZoneWidth, 0.1, FIELD_WIDTH * YARD_TO_METER]} />
      <meshStandardMaterial color={homeTeam.primaryColor} />
    </mesh>
  )
  
  // Away team end zone (right)
  surfaces.push(
    <mesh key="endzone-right" position={[(50 + END_ZONE_DEPTH / 2) * YARD_TO_METER, 0, 0]} receiveShadow>
      <boxGeometry args={[endZoneWidth, 0.1, FIELD_WIDTH * YARD_TO_METER]} />
      <meshStandardMaterial color={awayTeam.primaryColor} />
    </mesh>
  )
  
  // Team names in endzones
  const endZoneTextHeight = 0.15
  
  // Home team name (left endzone)
  surfaces.push(
    <Text
      key="home-team-name"
      position={[-(50 + END_ZONE_DEPTH / 2) * YARD_TO_METER, endZoneTextHeight, 0]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      fontSize={8 * YARD_TO_METER}
      color="white"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.1}
    >
      {homeTeam.name.toUpperCase()}
    </Text>
  )
  
  // Away team name (right endzone)
  surfaces.push(
    <Text
      key="away-team-name"
      position={[(50 + END_ZONE_DEPTH / 2) * YARD_TO_METER, endZoneTextHeight, 0]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      fontSize={8 * YARD_TO_METER}
      color="white"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.1}
    >
      {awayTeam.name.toUpperCase()}
    </Text>
  )
  
  return <>{surfaces}</>
}