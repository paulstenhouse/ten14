import { useState, useEffect } from 'react'
import { Conversation, Message } from '../../types/chat'
import ConversationSidebar from './ConversationSidebar'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import FieldViewer from '../FieldViewer'

export default function ChatInterface() {
  // Start with empty conversation for demo
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1')
  const [fieldDiagramOpenForMessage, setFieldDiagramOpenForMessage] = useState<string | null>(null)
  const [fieldDiagramMode, setFieldDiagramMode] = useState<'sidebar' | 'large' | 'fullscreen'>('sidebar')
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Detect mobile device (less than 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

    // Demo response - always show the field diagram
    const aiMessage: Message = {
      id: `m${Date.now() + 1}`,
      role: 'assistant',
      content: 'I\'ll show you a standard NFL offensive formation with the Kansas City Chiefs offense. Click the button below to see the field diagram with player positions and routes.',
      timestamp: new Date(),
      hasFieldDiagram: true
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
        {/* Conversation Sidebar (desktop only) */}
        {showSidebar && !isMobile && (
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
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                  </button>
                )}
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {selectedConversation.title}
                </h2>
              </div>

              {/* Messages */}
              {selectedConversation.messages.length === 0 ? (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ maxWidth: '500px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#fff' }}>
                      NFL Field Visualization Demo
                    </h3>
                    <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.5' }}>
                      Type any message below to see an interactive 3D NFL field diagram with player positions and formations.
                    </p>
                  </div>
                </div>
              ) : (
                <ChatMessages
                  messages={selectedConversation.messages}
                  onToggleFieldDiagram={handleToggleFieldDiagram}
                  fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
                />
              )}

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

        {/* Field Diagram Panel - sidebar or large mode (desktop only) */}
        {fieldDiagramOpenForMessage && fieldDiagramMode !== 'fullscreen' && !isMobile && (
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

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
          />
          
          {/* Sidebar */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#0a0a0a',
            zIndex: 1000,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            borderRight: '1px solid #333'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #333'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Conversations</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  color: '#888',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ×
              </button>
            </div>
            <ConversationSidebar
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelectConversation={(id) => {
                setSelectedConversationId(id)
                setSidebarOpen(false)
              }}
              onNewConversation={() => {
                handleNewConversation()
                setSidebarOpen(false)
              }}
            />
          </div>
        </>
      )}

      {/* Fullscreen Field Diagram or Mobile Sheet */}
      {fieldDiagramOpenForMessage && (fieldDiagramMode === 'fullscreen' || isMobile) && (
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
              Field Diagram {!isMobile && '- Fullscreen'}
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {!isMobile && (
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
              )}
              <button
                onClick={() => {
                  setFieldDiagramOpenForMessage(null)
                  setFieldDiagramMode('sidebar')
                }}
                style={{
                  padding: isMobile ? '8px 12px' : '4px 8px',
                  backgroundColor: 'transparent',
                  color: '#888',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '24px' : '20px',
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