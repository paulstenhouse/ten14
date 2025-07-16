import { useEffect, useState } from 'react'
import { AnimationFrame } from '../types/playData'
import { deJeanInterceptionPlay } from '../types/newPlayData'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PlayTimelineProps {
  frames: AnimationFrame[]
  currentTime: number
  isPlaying: boolean
  isAtEnd?: boolean
  onTimeSelect: (time: number) => void
  onPlayPause: () => void
  onReset: () => void
  className?: string
}

export default function PlayTimeline({ 
  frames, 
  currentTime, 
  isPlaying,
  isAtEnd = false,
  onTimeSelect,
  onPlayPause,
  onReset,
  className = ''
}: PlayTimelineProps) {
  const [hoveredTime, setHoveredTime] = useState<number | null>(null)
  
  const totalDuration = frames[frames.length - 1].frame_time_seconds
  const progressPercentage = (currentTime / totalDuration) * 100
  
  return (
    <div className={`bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
      {/* Play controls */}
      <div className="relative flex items-center justify-center mb-3">
        <button
          onClick={onPlayPause}
          className="px-3 py-1.5 bg-primary text-primary-foreground border-0 rounded text-xs font-medium transition-colors hover:bg-primary/90 flex items-center gap-1.5"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Play
            </>
          )}
        </button>
        {/* Show Replay button only when paused, not at the end, and not at the start */}
        {!isPlaying && !isAtEnd && currentTime > 0.1 && (
          <button
            onClick={onReset}
            className="absolute right-0 px-3 py-1.5 bg-secondary text-secondary-foreground border-0 rounded text-xs font-medium transition-colors hover:bg-secondary/80 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Replay
          </button>
        )}
      </div>
      
      <div className="relative">
        {/* Timeline track */}
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          {/* Progress bar */}
          <div 
            className={`absolute left-0 top-0 h-full bg-primary ${isPlaying ? 'transition-[width] duration-300 ease-linear' : ''}`}
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Frame markers - positioned on top of progress */}
          {frames.map((frame, index) => {
            const position = (frame.frame_time_seconds / totalDuration) * 100
            const isActive = currentTime >= frame.frame_time_seconds
            const isHovered = hoveredTime === frame.frame_time_seconds
            
            return (
              <button
                key={index}
                className={`absolute top-1/2 w-4 h-4 rounded-full border-2 transition-all cursor-pointer
                  ${isActive ? 'bg-primary border-primary' : 'bg-black border-white/40'}
                  ${isHovered ? 'scale-150' : 'scale-100'}
                  hover:scale-150 hover:border-white`}
                style={{ 
                  left: `${position}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => onTimeSelect(frame.frame_time_seconds)}
                onMouseEnter={() => setHoveredTime(frame.frame_time_seconds)}
                onMouseLeave={() => setHoveredTime(null)}
              />
            )
          })}
          
          {/* Current time indicator */}
          <div 
            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg pointer-events-none"
            style={{ 
              left: `${progressPercentage}%`, 
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
        
        {/* Time labels */}
        <div className="relative mt-2 text-xs text-white/60" style={{ height: '20px' }}>
          {frames.map((frame, index) => {
            const position = (frame.frame_time_seconds / totalDuration) * 100
            return (
              <button
                key={index}
                className={`absolute transition-colors cursor-pointer hover:text-white
                  ${Math.abs(currentTime - frame.frame_time_seconds) < 0.1 ? 'text-primary font-bold' : ''}`}
                style={{ 
                  left: `${position}%`, 
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => onTimeSelect(frame.frame_time_seconds)}
              >
                {frame.frame_time_seconds.toFixed(1)}s
              </button>
            )
          })}
        </div>
        
        {/* Play description - single line */}
        <div className="mt-2 text-xs text-white/70 text-center truncate">
          {(() => {
            // Find the current frame description
            const currentFrame = deJeanInterceptionPlay.plays.find((play, index) => {
              const nextPlay = deJeanInterceptionPlay.plays[index + 1]
              if (!nextPlay) return currentTime >= play.time
              return currentTime >= play.time && currentTime < nextPlay.time
            })
            
            if (currentFrame?.description) {
              return currentFrame.description
            } else if (currentTime < 0.1 && deJeanInterceptionPlay.summary_of_play) {
              return deJeanInterceptionPlay.summary_of_play
            }
            return ""
          })()}
        </div>
      </div>
    </div>
  )
}