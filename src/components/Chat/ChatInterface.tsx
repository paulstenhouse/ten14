import { useState } from 'react'
import { Conversation, Message } from '../../types/chat'
import ConversationSidebar from './ConversationSidebar'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import FieldViewer from '../FieldViewer'

export default function ChatInterface() {
  // Mock data for demonstration
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'NFL Play Analysis',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Can you show me a typical NFL offensive formation?',
          timestamp: new Date('2024-01-15T10:00:00')
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'I\'ll show you a standard NFL offensive formation with the Kansas City Chiefs offense. Click the button below to see the field diagram with player positions and routes.',
          timestamp: new Date('2024-01-15T10:00:30'),
          hasFieldDiagram: true
        }
      ],
      createdAt: new Date('2024-01-15T10:00:00'),
      updatedAt: new Date('2024-01-15T10:00:30')
    },
    {
      id: '2',
      title: 'Defensive Strategies',
      messages: [
        {
          id: 'm3',
          role: 'user',
          content: 'What defensive formations work best against passing plays?',
          timestamp: new Date('2024-01-15T11:00:00')
        },
        {
          id: 'm4',
          role: 'assistant',
          content: 'For defending against passing plays, teams often use nickel or dime formations with extra defensive backs. Let me show you a typical defensive setup.',
          timestamp: new Date('2024-01-15T11:00:30'),
          hasFieldDiagram: true
        }
      ],
      createdAt: new Date('2024-01-15T11:00:00'),
      updatedAt: new Date('2024-01-15T11:00:30')
    }
  ])

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1')
  const [fieldDiagramOpenForMessage, setFieldDiagramOpenForMessage] = useState<string | null>('m2') // Start with field open for message m2
  const [fieldDiagramMode, setFieldDiagramMode] = useState<'sidebar' | 'large' | 'fullscreen'>('sidebar')

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations([newConversation, ...conversations])
    setSelectedConversationId(newConversation.id)
  }

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }

    // Simulate AI response
    const aiMessage: Message = {
      id: `m${Date.now() + 1}`,
      role: 'assistant',
      content: 'I understand your question about the play. Let me analyze the field formation for you.',
      timestamp: new Date(),
      hasFieldDiagram: content.toLowerCase().includes('show') || content.toLowerCase().includes('field')
    }

    setConversations(convs => 
      convs.map(conv => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, aiMessage],
            updatedAt: new Date(),
            title: conv.messages.length === 0 ? content.substring(0, 30) + '...' : conv.title
          }
        }
        return conv
      })
    )
  }

  const handleToggleFieldDiagram = (messageId: string) => {
    setFieldDiagramOpenForMessage(
      fieldDiagramOpenForMessage === messageId ? null : messageId
    )
  }

  // Determine layout based on field diagram mode
  const showSidebar = fieldDiagramMode === 'fullscreen' ? false : (fieldDiagramMode === 'large' && fieldDiagramOpenForMessage ? false : true)
  const chatWidth = fieldDiagramMode === 'fullscreen' ? '0' : (fieldDiagramMode === 'large' && fieldDiagramOpenForMessage ? '300px' : undefined)
  const fieldWidth = fieldDiagramMode === 'sidebar' ? '600px' : undefined

  return (
    <>
      <div style={{
        display: fieldDiagramMode === 'fullscreen' && fieldDiagramOpenForMessage ? 'none' : 'flex',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Conversation Sidebar */}
        {showSidebar && (
          <ConversationSidebar
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onNewConversation={handleNewConversation}
          />
        )}

        {/* Main Chat Area */}
        <div style={{
          width: chatWidth,
          flex: chatWidth ? undefined : 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#111111'
        }}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #333',
                backgroundColor: '#1a1a1a'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {selectedConversation.title}
                </h2>
              </div>

              {/* Messages */}
              <ChatMessages
                messages={selectedConversation.messages}
                onToggleFieldDiagram={handleToggleFieldDiagram}
                fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
              />

              {/* Input */}
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              Select a conversation or start a new one
            </div>
          )}
        </div>

        {/* Field Diagram Panel - sidebar or large mode */}
        {fieldDiagramOpenForMessage && fieldDiagramMode !== 'fullscreen' && (
          <div style={{
            width: fieldWidth,
            flex: fieldWidth ? undefined : 1,
            borderLeft: '1px solid #333',
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #333',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1a1a1a'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                Field Diagram
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* View mode buttons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setFieldDiagramMode('sidebar')}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: fieldDiagramMode === 'sidebar' ? '#374151' : 'transparent',
                      color: fieldDiagramMode === 'sidebar' ? 'white' : '#888',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Sidebar
                  </button>
                  <button
                    onClick={() => setFieldDiagramMode('large')}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: fieldDiagramMode === 'large' ? '#374151' : 'transparent',
                      color: fieldDiagramMode === 'large' ? 'white' : '#888',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setFieldDiagramMode('fullscreen')}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      color: '#888',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Fullscreen
                  </button>
                </div>
                <button
                  onClick={() => setFieldDiagramOpenForMessage(null)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    color: '#888',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    lineHeight: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#888'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <FieldViewer />
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Field Diagram */}
      {fieldDiagramOpenForMessage && fieldDiagramMode === 'fullscreen' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1a1a1a'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0
            }}>
              Field Diagram - Fullscreen
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setFieldDiagramMode('sidebar')}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  color: '#888',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Exit Fullscreen
              </button>
              <button
                onClick={() => {
                  setFieldDiagramOpenForMessage(null)
                  setFieldDiagramMode('sidebar')
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  color: '#888',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888'
                }}
              >
                ×
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <FieldViewer />
          </div>
        </div>
      )}
    </>
  )
}