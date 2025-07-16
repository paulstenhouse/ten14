import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Brain, Clock, Coins, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Message } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MessageMetadataProps {
  message: Message
  className?: string
  onRetry?: () => void
  onRateUp?: () => void
  onRateDown?: () => void
}

export function MessageMetadata({ message, className, onRetry, onRateUp, onRateDown }: MessageMetadataProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [rated, setRated] = useState<'up' | 'down' | null>(null)
  
  if (message.role !== 'assistant' || !message.metadata) {
    return null
  }
  
  const { metadata } = message
  const hasAgents = metadata.agents && metadata.agents.length > 0
  
  // Format duration
  const formatDuration = (ms?: number) => {
    if (!ms) return null
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }
  
  // Format tokens
  const formatTokens = (tokens?: number) => {
    if (!tokens) return null
    return tokens.toLocaleString()
  }
  
  // Calculate total agent tokens
  const totalAgentTokens = metadata.agents?.reduce((sum, agent) => sum + agent.tokens, 0) || 0
  
  // Always show metadata for assistant messages that have metadata
  // (removed the simulation check)
  
  return (
    <div className={cn("mt-2 text-xs text-muted-foreground", className)}>
      {/* Main metadata row */}
      <div className="flex items-center justify-between">
        {/* Clickable accordion toggle and duration */}
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="flex items-center gap-2 p-0.5 -m-0.5 hover:text-foreground transition-colors"
          aria-label={showMetadata ? "Hide metadata" : "Show metadata"}
        >
          <ChevronRight 
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              showMetadata && "rotate-90"
            )}
          />
          
          {/* Duration beside accordion */}
          {metadata.duration && (
            <span>{formatDuration(metadata.duration)}</span>
          )}
        </button>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Retry button */}
          <button
            onClick={() => onRetry?.()}
            className="p-1 hover:text-foreground transition-colors rounded hover:bg-accent"
            aria-label="Retry response"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
          
          {/* Thumbs up */}
          <button
            onClick={() => {
              setRated(rated === 'up' ? null : 'up')
              if (rated !== 'up') onRateUp?.()
            }}
            className={cn(
              "p-1 transition-colors rounded hover:bg-accent",
              rated === 'up' ? "text-green-600 dark:text-green-400" : "hover:text-foreground"
            )}
            aria-label="Rate positively"
          >
            <ThumbsUp className="h-3 w-3" />
          </button>
          
          {/* Thumbs down */}
          <button
            onClick={() => {
              setRated(rated === 'down' ? null : 'down')
              if (rated !== 'down') onRateDown?.()
            }}
            className={cn(
              "p-1 transition-colors rounded hover:bg-accent",
              rated === 'down' ? "text-red-600 dark:text-red-400" : "hover:text-foreground"
            )}
            aria-label="Rate negatively"
          >
            <ThumbsDown className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      {/* Expanded metadata card */}
      {showMetadata && (
        <div className="mt-1.5 p-2 rounded bg-muted/30 border border-border/50">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Token count */}
            {metadata.usage?.totalTokens && (
              <span className="flex items-center gap-1">
                <span className="font-mono">{formatTokens(metadata.usage.totalTokens)}</span>
                <span>tokens</span>
              </span>
            )}
            
            {/* Duration with icon */}
            {metadata.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(metadata.duration)}</span>
              </span>
            )}
            
            {/* Cost */}
            {metadata.estimatedCost && (
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                <span>${metadata.estimatedCost.toFixed(4)}</span>
              </span>
            )}
            
            {/* Model */}
            {metadata.model && (
              <span className="text-muted-foreground/70">
                {metadata.model}
              </span>
            )}
            
            {/* Thinking button */}
            {hasAgents && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReasoning(!showReasoning)}
                className="h-6 px-2 py-0 text-xs gap-1"
              >
                <Brain className="h-3 w-3" />
                Thinking
                {showReasoning ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
          
          {/* Reasoning section inside the card */}
          {showReasoning && hasAgents && (
            <div className="mt-2 pt-2 border-t border-border/50 space-y-2">
              {metadata.agents!.map((agent, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-muted-foreground/70 font-medium">
                    Agent {index + 1}
                  </div>
                  <div className="text-xs text-foreground/70 whitespace-pre-wrap font-mono bg-background/50 rounded p-1.5">
                    {agent.reasoning}
                  </div>
                </div>
              ))}
              
            </div>
          )}
        </div>
      )}
    </div>
  )
}