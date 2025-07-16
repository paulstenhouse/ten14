import { useState, useEffect } from 'react'
import { Conversation, Message } from '../../types/chat'
import ConversationSidebar from './ConversationSidebarTailwind'
import ChatMessages from './ChatMessagesTailwind'
import ChatInput from './ChatInputTailwind'
import FieldViewer from '../FieldViewer'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { Menu, X, Maximize2, Minimize2 } from 'lucide-react'

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
  const showSidebar = !isMobile && (fieldDiagramMode === 'fullscreen' ? false : (fieldDiagramMode === 'large' && fieldDiagramOpenForMessage ? false : true))

  return (
    <>
      <div className={`flex h-screen bg-background text-foreground ${fieldDiagramMode === 'fullscreen' && fieldDiagramOpenForMessage ? 'hidden' : ''}`}>
        {/* Desktop Conversation Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block">
            <ConversationSidebar
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className={`flex flex-1 flex-col bg-zinc-900 ${fieldDiagramMode === 'large' && fieldDiagramOpenForMessage && !isMobile ? 'w-[300px] flex-none' : ''}`}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-border bg-zinc-900 px-4 py-3 lg:px-6">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold">
                  {selectedConversation.title}
                </h2>
              </div>

              {/* Messages */}
              {selectedConversation.messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-6 text-center">
                  <div className="max-w-lg">
                    <h3 className="mb-3 text-2xl font-semibold text-foreground">
                      NFL Field Visualization Demo
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
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
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Select a conversation or start a new one
            </div>
          )}
        </div>

        {/* Desktop Field Diagram Panel */}
        {fieldDiagramOpenForMessage && !isMobile && fieldDiagramMode !== 'fullscreen' && (
          <div className={`flex flex-col border-l border-border bg-background ${fieldDiagramMode === 'sidebar' ? 'w-[600px]' : 'flex-1'}`}>
            <div className="flex items-center justify-between border-b border-border bg-zinc-950 px-4 py-3">
              <h3 className="text-base font-semibold">Field Diagram</h3>
              <div className="flex items-center gap-2">
                {/* View mode buttons */}
                <div className="flex gap-1">
                  <Button
                    variant={fieldDiagramMode === 'sidebar' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFieldDiagramMode('sidebar')}
                  >
                    Sidebar
                  </Button>
                  <Button
                    variant={fieldDiagramMode === 'large' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFieldDiagramMode('large')}
                  >
                    Large
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFieldDiagramMode('fullscreen')}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFieldDiagramOpenForMessage(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <FieldViewer key={`field-${fieldDiagramMode}`} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen && isMobile} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] bg-background p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>

      {/* Fullscreen/Mobile Field Diagram */}
      {fieldDiagramOpenForMessage && (fieldDiagramMode === 'fullscreen' || isMobile) && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border bg-zinc-950 px-4 py-3">
            <h3 className="text-base font-semibold">
              Field Diagram {!isMobile && '- Fullscreen'}
            </h3>
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFieldDiagramMode('sidebar')}
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  setFieldDiagramOpenForMessage(null)
                  setFieldDiagramMode('sidebar')
                }}
              >
                <X className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <FieldViewer />
          </div>
        </div>
      )}
    </>
  )
}