import FieldSurface from './FieldSurface'
import FieldLines from './FieldLines'
import HashMarks from './HashMarks'
import FieldNumbers from './FieldNumbers'
import Pylons from './Pylons'
import GoalPosts from './GoalPosts'
import Players from './Players'
import PlayersFromData from './PlayersFromData'
import PlayersAnimated from './PlayersAnimated'
import Playbook from './Playbook'
import Dome from './Dome'
import FieldLogo from './FieldLogo'
import { NFLTeam } from '../data/nflTeams'
import { PlayData, AnimationFrame } from '../types/playData'

interface NFLFieldProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  playData?: PlayData
  animationFrames?: AnimationFrame[]
  isAnimating?: boolean
  onAnimationComplete?: () => void
  onFrameChange?: (frameIndex: number) => void
  onTimeChange?: (time: number) => void
  seekTime?: number | null
  showOpenSpace?: boolean
  selectedPlayers?: Set<string>
  setSelectedPlayers?: (players: Set<string>) => void
}

export default function NFLField({ 
  homeTeam, 
  awayTeam, 
  playData, 
  animationFrames, 
  isAnimating,
  onAnimationComplete,
  onFrameChange,
  onTimeChange,
  seekTime,
  showOpenSpace = false,
  selectedPlayers,
  setSelectedPlayers
}: NFLFieldProps) {
  return (
    <group>
      <Dome />
      <FieldSurface homeTeam={homeTeam} awayTeam={awayTeam} />
      <FieldLogo />
      <FieldLines />
      <HashMarks />
      <FieldNumbers />
      <Pylons />
      <GoalPosts />
      {animationFrames && isAnimating !== undefined ? (
        <PlayersAnimated 
          homeTeam={homeTeam} 
          awayTeam={awayTeam} 
          animationFrames={animationFrames}
          isPlaying={isAnimating}
          onPlayComplete={onAnimationComplete}
          onFrameChange={onFrameChange}
          onTimeChange={onTimeChange}
          seekTime={seekTime}
          showOpenSpace={showOpenSpace}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />
      ) : playData ? (
        <PlayersFromData homeTeam={homeTeam} awayTeam={awayTeam} playData={playData} />
      ) : (
        <Players homeTeam={homeTeam} awayTeam={awayTeam} />
      )}
    </group>
  )
}