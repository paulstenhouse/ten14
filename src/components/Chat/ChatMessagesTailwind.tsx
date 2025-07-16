import { Message } from '../../types/chat'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'
import { deJeanInterceptionPlay } from '../../types/newPlayData'
import { MessageMetadata } from './MessageMetadata'

interface ChatMessagesProps {
  messages: Message[]
  onToggleFieldDiagram: (messageId: string) => void
  fieldDiagramOpenForMessage: string | null
  currentPlayDescription?: string
}

export default function ChatMessages({ 
  messages, 
  onToggleFieldDiagram,
  fieldDiagramOpenForMessage,
  currentPlayDescription 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div className={cn(
            "max-w-[70%]",
            message.role === 'user' && "rounded-xl px-4 py-3 bg-secondary text-secondary-foreground"
          )}>
            <div className={cn(
              "whitespace-pre-wrap text-sm",
              message.role === 'assistant' && "text-foreground"
            )}>
              {message.content}
            </div>
            
            {message.simulation && (
              <>
                <div
                  onClick={() => onToggleFieldDiagram(message.id)}
                  className="mt-3 p-4 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg border border-red-500/20"
                >
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-white">
                      🏈 {message.simulation.displayTitle || 'NFL Play Visualization'}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed mb-3">
                    {deJeanInterceptionPlay.summary_of_play}
                  </p>
                  <div className="flex justify-between items-end">
                    {/* Simulation metadata footer */}
                    <div className="text-xs text-white/70 flex items-center gap-3">
                      {message.metadata?.usage?.totalTokens && (
                        <span className="font-mono">
                          {message.metadata.usage.totalTokens.toLocaleString()} tokens
                        </span>
                      )}
                      {message.metadata?.duration && (
                        <span>
                          {message.metadata.duration < 1000 
                            ? `${message.metadata.duration}ms` 
                            : `${(message.metadata.duration / 1000).toFixed(1)}s`}
                        </span>
                      )}
                      {message.metadata?.estimatedCost && (
                        <span>${message.metadata.estimatedCost.toFixed(4)}</span>
                      )}
                    </div>
                    
                    <button 
                      className="px-3 py-1.5 bg-white text-red-700 rounded-md text-xs font-medium flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFieldDiagram(message.id)
                      }}
                    >
                      {fieldDiagramOpenForMessage === message.id ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Watch
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Message metadata for AI responses */}
            <MessageMetadata message={message} />
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}