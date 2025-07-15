import { Message } from '../../types/chat'
import { useEffect, useRef } from 'react'

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
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <div style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: message.role === 'user' ? '#2563eb' : '#374151',
            color: 'white',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
            
            {message.hasFieldDiagram && (
              <button
                onClick={() => onToggleFieldDiagram(message.id)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {fieldDiagramOpenForMessage === message.id ? '📉 Hide' : '📊 Show'} Field Diagram
              </button>
            )}
            
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '4px'
            }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}