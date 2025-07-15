import FieldSurface from './FieldSurface'
import FieldLines from './FieldLines'
import HashMarks from './HashMarks'
import FieldNumbers from './FieldNumbers'
import Pylons from './Pylons'
import GoalPosts from './GoalPosts'
import Players from './Players'
import Playbook from './Playbook'
import Dome from './Dome'
import { NFLTeam } from '../data/nflTeams'

interface NFLFieldProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
}

export default function NFLField({ homeTeam, awayTeam }: NFLFieldProps) {
  return (
    <group>
      <Dome />
      <FieldSurface homeTeam={homeTeam} awayTeam={awayTeam} />
      <FieldLines />
      <HashMarks />
      <FieldNumbers />
      <Pylons />
      <GoalPosts />
      <Players homeTeam={homeTeam} awayTeam={awayTeam} />
      <Playbook />
    </group>
  )
}