import { Message } from '../../types/chat'
import { useEffect, useRef } from 'react'

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
              <>
                {fieldDiagramOpenForMessage === message.id ? (
                  <button
                    onClick={() => onToggleFieldDiagram(message.id)}
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span>🔽</span> Hide Simulation
                  </button>
                ) : (
                  <div
                    onClick={() => onToggleFieldDiagram(message.id)}
                    style={{
                      marginTop: '12px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid rgba(96, 165, 250, 0.3)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.25)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        🏈 DeJean INT Return - 70 yards
                      </span>
                      <span style={{ fontSize: '12px', opacity: 0.8 }}>
                        ▶ Watch
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      opacity: 0.9,
                      lineHeight: '1.4'
                    }}>
                      Experience the game-changing interception return with interactive 3D visualization
                    </p>
                  </div>
                )}
                
                {/* Show play description when simulation is open */}
                {fieldDiagramOpenForMessage === message.id && currentPlayDescription && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    {currentPlayDescription}
                  </div>
                )}
              </>
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