import { useState } from 'react'
import { Info, ChevronDown, ChevronUp, Calendar, MessageSquare, Zap, DollarSign, BarChart3 } from 'lucide-react'
import { Thread, Message } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThreadDetailsProps {
  thread: Thread
  messages: Message[]
  className?: string
}

export function ThreadDetails({ thread, messages, className }: ThreadDetailsProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Calculate thread statistics from messages
  const calculateStats = () => {
    let totalTokens = 0
    let totalCost = 0
    const modelBreakdown: { [model: string]: { tokens: number; cost: number } } = {}
    
    messages.forEach(message => {
      if (message.metadata?.usage?.totalTokens) {
        totalTokens += message.metadata.usage.totalTokens
      }
      if (message.metadata?.estimatedCost) {
        totalCost += message.metadata.estimatedCost
      }
      if (message.metadata?.model) {
        const model = message.metadata.model
        if (!modelBreakdown[model]) {
          modelBreakdown[model] = { tokens: 0, cost: 0 }
        }
        modelBreakdown[model].tokens += message.metadata.usage?.totalTokens || 0
        modelBreakdown[model].cost += message.metadata.estimatedCost || 0
      }
    })
    
    return { totalTokens, totalCost, messageCount: messages.length, modelBreakdown }
  }
  
  const stats = thread.stats || calculateStats()
  
  // Format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }
  
  return (
    <div className={cn("", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="h-8 px-2 text-xs gap-1"
      >
        <Info className="h-3.5 w-3.5" />
        Details
        {showDetails ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>
      
      {showDetails && (
        <div className="absolute top-full left-0 right-0 mt-1 mx-4 p-4 bg-background border border-border shadow-lg rounded-lg z-10">
          <h3 className="text-sm font-semibold mb-3">Thread Details</h3>
          
          <div className="space-y-3 text-xs">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">{formatDate(thread.createdAt)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Messages</div>
                  <div className="font-medium">{stats.messageCount || 0}</div>
                </div>
              </div>
            </div>
            
            {/* Usage stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Total Tokens</div>
                  <div className="font-medium font-mono">{formatNumber(stats.totalTokens || 0)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Total Cost</div>
                  <div className="font-medium">${(stats.totalCost || 0).toFixed(4)}</div>
                </div>
              </div>
            </div>
            
            {/* Model breakdown */}
            {stats.modelBreakdown && Object.keys(stats.modelBreakdown).length > 0 && (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Model Usage</span>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(stats.modelBreakdown).map(([model, data]) => (
                    <div key={model} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{model}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono">{formatNumber(data.tokens)} tokens</span>
                        <span>${data.cost.toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Metadata tags */}
            {thread.metadata && (thread.metadata.tags || thread.metadata.teams) && (
              <div className="pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1.5">
                  {thread.metadata.sport && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs">
                      {thread.metadata.sport.toUpperCase()}
                    </span>
                  )}
                  {thread.metadata.teams?.map(team => (
                    <span key={team} className="px-2 py-0.5 bg-muted rounded-md text-xs">
                      {team}
                    </span>
                  ))}
                  {thread.metadata.tags?.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-muted rounded-md text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}