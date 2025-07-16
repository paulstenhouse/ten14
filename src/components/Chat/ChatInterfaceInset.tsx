import { useState, useEffect, useRef } from 'react'
import { Conversation, Message } from '@/types/chat'
import ChatMessages from './ChatMessagesTailwind'
import ChatInput from './ChatInputTailwind'
import FieldViewer from '../FieldViewer'
import { AppSidebarChat } from '@/components/app-sidebar-chat'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export default function ChatInterfaceInset() {
  // Generate fake conversation data with different time periods
  const generateFakeConversations = (): Conversation[] => {
    const now = new Date()
    const conversations: Conversation[] = []
    
    // Today's conversations
    conversations.push({
      id: '1',
      title: 'NFL Formation Analysis',
      messages: [],
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    })
    
    conversations.push({
      id: '2',
      title: 'Chiefs Offensive Playbook',
      messages: [],
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000)
    })
    
    // Yesterday's conversations
    conversations.push({
      id: '3',
      title: 'Defense Formation Setup',
      messages: [],
      createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000), // 28 hours ago
      updatedAt: new Date(now.getTime() - 28 * 60 * 60 * 1000)
    })
    
    conversations.push({
      id: '4',
      title: 'Red Zone Strategies',
      messages: [],
      createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000), // 36 hours ago
      updatedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000)
    })
    
    // Last week's conversations
    conversations.push({
      id: '5',
      title: 'Quarterback Positioning',
      messages: [],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    })
    
    conversations.push({
      id: '6',
      title: 'Wide Receiver Routes',
      messages: [],
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    })
    
    // Earlier conversations
    conversations.push({
      id: '7',
      title: 'Offensive Line Formations',
      messages: [],
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    })
    
    conversations.push({
      id: '8',
      title: 'Special Teams Strategy',
      messages: [],
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      updatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    })
    
    return conversations
  }
  
  const [conversations, setConversations] = useState<Conversation[]>(generateFakeConversations())

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1')
  const [fieldDiagramOpenForMessage, setFieldDiagramOpenForMessage] = useState<string | null>(null)
  const [fieldDiagramMode, setFieldDiagramMode] = useState<'sidebar' | 'large' | 'fullscreen'>('sidebar')
  const [isMobile, setIsMobile] = useState(false)
  const [mainAreaWidth, setMainAreaWidth] = useState(window.innerWidth)
  const mainAreaRef = useRef<HTMLDivElement>(null)
  
  // Check for mobile breakpoint at 728px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 728)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Monitor main area width
  useEffect(() => {
    const checkMainAreaWidth = () => {
      if (mainAreaRef.current) {
        const width = mainAreaRef.current.offsetWidth
        setMainAreaWidth(width)
      }
    }
    
    checkMainAreaWidth()
    window.addEventListener('resize', checkMainAreaWidth)
    
    // Use ResizeObserver for more accurate detection
    const resizeObserver = new ResizeObserver(checkMainAreaWidth)
    if (mainAreaRef.current) {
      resizeObserver.observe(mainAreaRef.current)
    }
    
    // Also check when sidebar state changes with a delay for animation
    const sidebarObserver = new MutationObserver(() => {
      // Wait for sidebar animation to complete
      setTimeout(checkMainAreaWidth, 300)
    })
    sidebarObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-sidebar-state']
    })
    
    return () => {
      window.removeEventListener('resize', checkMainAreaWidth)
      resizeObserver.disconnect()
      sidebarObserver.disconnect()
    }
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
      content: 'I\'ll show you the moment Cooper DeJean intercepted Patrick Mahomes\' pass - a pivotal play from the Chiefs vs Eagles game. Click the button below to see the exact player positions at the moment of the interception.',
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
    if (fieldDiagramOpenForMessage === messageId) {
      setFieldDiagramOpenForMessage(null)
    } else {
      setFieldDiagramOpenForMessage(messageId)
      // Auto-switch to fullscreen if main area is too narrow for sidebar
      if (mainAreaWidth < 650) {
        setFieldDiagramMode('fullscreen')
      }
    }
  }

  return (
    <>
      <SidebarProvider defaultOpen={!isMobile}>
        <AppSidebarChat 
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onNewConversation={handleNewConversation}
          className={isMobile ? 'z-40' : ''}
        />
        <SidebarInset className="overflow-hidden" ref={mainAreaRef}>
          {fieldDiagramOpenForMessage && fieldDiagramMode !== 'fullscreen' && !isMobile && mainAreaWidth >= 650 ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={35}>
                {/* Chat Section */}
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px]">
                    <SidebarTrigger className="text-foreground" />
                    <Separator orientation="vertical" className="h-6" />
                    {selectedConversation && (
                      <h2 className="text-lg font-semibold text-foreground">
                        {selectedConversation.title}
                      </h2>
                    )}
                  </header>

                  {/* Chat Content */}
                  {selectedConversation ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1">
                        {selectedConversation.messages.length === 0 ? (
                          <div className="flex h-full items-center justify-center p-6 text-center">
                            <div className="max-w-lg">
                              <h3 className="mb-3 text-2xl font-semibold text-foreground">
                                NFL Play Visualization Demo
                              </h3>
                              <p className="text-base leading-relaxed text-muted-foreground">
                                Experience Cooper DeJean's game-changing interception! Type any message below to see the exact player positions from this pivotal Chiefs vs Eagles moment.
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
                      </div>

                      {/* Input */}
                      <ChatInput onSendMessage={handleSendMessage} />
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                      Select a conversation or start a new one
                    </div>
                  )}
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={35}>
                {/* Simulation Panel */}
                <div className="flex h-full flex-col">
                  <div className="flex h-14 items-center justify-between border-b border-border px-4 lg:h-[60px]">
                    <h3 className="text-base font-semibold text-foreground">Simulation</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFieldDiagramMode('fullscreen')}
                        title="Fullscreen"
                      >
                        <Maximize2 className="h-4 w-4 text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFieldDiagramOpenForMessage(null)}
                      >
                        <X className="h-5 w-5 text-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <FieldViewer key={`field-${fieldDiagramMode}`} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex h-full">
              {/* Chat Section */}
              <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px]">
                  <SidebarTrigger className="text-foreground" />
                  <Separator orientation="vertical" className="h-6" />
                  {selectedConversation && (
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedConversation.title}
                    </h2>
                  )}
                </header>

                {/* Chat Content */}
                {selectedConversation ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1">
                      {selectedConversation.messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center p-6 text-center">
                          <div className="max-w-lg">
                            <h3 className="mb-3 text-2xl font-semibold text-foreground">
                              NFL Play Visualization Demo
                            </h3>
                            <p className="text-base leading-relaxed text-muted-foreground">
                              Experience Cooper DeJean's game-changing interception! Type any message below to see the exact player positions from this pivotal Chiefs vs Eagles moment.
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
                    </div>

                    {/* Input */}
                    <ChatInput onSendMessage={handleSendMessage} />
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-muted-foreground">
                    Select a conversation or start a new one
                  </div>
                )}
              </div>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>

      {/* Fullscreen Field Diagram (outside main area) */}
      {fieldDiagramOpenForMessage && fieldDiagramMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:h-[60px]">
            <h3 className="text-base font-semibold text-foreground">
              Simulation - Fullscreen
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFieldDiagramMode('sidebar')}
              >
                <Minimize2 className="h-4 w-4 mr-2 text-foreground" />
                Exit Fullscreen
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  setFieldDiagramOpenForMessage(null)
                  setFieldDiagramMode('sidebar')
                }}
              >
                <X className="h-5 w-5 text-foreground" />
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