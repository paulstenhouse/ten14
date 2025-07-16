import { Message } from '../../types/chat'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ChatMessagesProps {
  messages: Message[]
  onToggleFieldDiagram: (messageId: string) => void
  fieldDiagramOpenForMessage: string | null
}

export default function ChatMessages({ 
  messages, 
  onToggleFieldDiagram,
  fieldDiagramOpenForMessage 
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
            "max-w-[70%] rounded-xl px-4 py-3",
            message.role === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          )}>
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            
            {message.hasFieldDiagram && (
              <Button
                onClick={() => onToggleFieldDiagram(message.id)}
                variant="outline"
                size="sm"
                className="mt-2 h-8 hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                {fieldDiagramOpenForMessage === message.id ? (
                  <>
                    <EyeOff className="mr-2 h-3 w-3" />
                    Hide Simulation
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-3 w-3" />
                    View Simulation
                  </>
                )}
              </Button>
            )}
            
            <div className="mt-1 text-xs opacity-50">
              {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}