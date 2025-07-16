import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Thread, Message } from '@/types/chat'
import ChatMessages from './ChatMessagesTailwind'
import ChatInput from './ChatInputTailwind'
import FieldViewer from '../FieldViewer'
import { AppSidebarChat } from '@/components/app-sidebar-chat'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { X, Maximize2, Minimize2, Plus } from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

function ChatInterfaceContent() {
  const sidebar = useSidebar()
  const navigate = useNavigate()
  const { conversationId } = useParams()
  // Generate fake thread data
  const generateFakeThreads = (): Thread[] => {
    const now = new Date()
    const threads: Thread[] = []
    
    // Yesterday's threads
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'DeJean Interception Analysis',
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['interception', 'eagles', 'chiefs'],
        sport: 'nfl',
        teams: ['PHI', 'KC']
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Chiefs Red Zone Offense',
      createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 28 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['offense', 'red-zone', 'chiefs'],
        sport: 'nfl',
        teams: ['KC']
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Defense Formation Setup',
      createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['defense', 'formation', 'strategy'],
        sport: 'nfl'
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Eagles Coverage Schemes',
      createdAt: new Date(now.getTime() - 32 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 32 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['coverage', 'defense', 'eagles'],
        sport: 'nfl',
        teams: ['PHI']
      }
    })
    
    // Last week's threads
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Quarterback Positioning',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['quarterback', 'positioning', 'offense'],
        sport: 'nfl'
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440006',
      title: 'Wide Receiver Routes',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['routes', 'receivers', 'offense'],
        sport: 'nfl'
      }
    })
    
    // Earlier threads
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440007',
      title: 'Offensive Line Formations',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['offensive-line', 'formations', 'blocking'],
        sport: 'nfl'
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440008',
      title: 'Special Teams Strategy',
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['special-teams', 'strategy', 'kicking'],
        sport: 'nfl'
      }
    })
    
    return threads
  }
  
  // Generate fake messages for demo threads
  const generateFakeMessages = (): Map<string, Message[]> => {
    const messagesMap = new Map<string, Message[]>()
    
    // DeJean Interception Analysis
    messagesMap.set('550e8400-e29b-41d4-a716-446655440001', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440001',
        role: 'user',
        content: 'Can you break down the DeJean interception? What made it such a game-changing play?',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440001',
        role: 'assistant',
        content: 'Cooper DeJean\'s interception was a masterclass in reading the quarterback. He baited Mahomes by initially showing coverage on the underneath route, then broke on the ball at the perfect moment. The 70-yard return completely shifted momentum - the Eagles went from defending in their own territory to having the ball in prime scoring position. This kind of play showcases elite instincts and film study paying off.',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Chiefs Red Zone Offense
    messagesMap.set('550e8400-e29b-41d4-a716-446655440002', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440002',
        role: 'user',
        content: 'How effective have the Chiefs been in the red zone this season?',
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440002',
        role: 'assistant',
        content: 'The Chiefs have been remarkably efficient in the red zone, converting TDs on 68% of their trips inside the 20. Their success stems from Andy Reid\'s creative play-calling and Mahomes\' ability to extend plays. They frequently use motion to create mismatches, and Travis Kelce becomes nearly unstoppable in these compressed spaces. The addition of quick-hitting RPOs has made them even more dangerous near the goal line.',
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Defense Formation Setup
    messagesMap.set('550e8400-e29b-41d4-a716-446655440003', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440003',
        role: 'user',
        content: 'What are the key defensive formations teams are using against modern offenses?',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440003',
        role: 'assistant',
        content: 'Modern defenses are increasingly relying on nickel and dime packages as their base formations. With offenses spreading the field more, having 5-6 DBs on the field has become essential. The "Big Nickel" with a safety-linebacker hybrid is particularly popular. Teams are also using more simulated pressures and post-snap rotation to confuse QBs while maintaining coverage integrity.',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Eagles Coverage Schemes
    messagesMap.set('550e8400-e29b-41d4-a716-446655440004', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440004',
        role: 'user',
        content: 'What makes the Eagles\' coverage schemes so effective this year?',
        timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440004',
        role: 'assistant',
        content: 'The Eagles have mastered the art of disguise. They show one coverage pre-snap and rotate to another post-snap about 40% of the time. Their corners play aggressive press-man coverage, allowing safeties to provide help over the top. The addition of veteran leadership in the secondary has improved their communication, making these complex schemes executable at game speed.',
        timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Quarterback Positioning
    messagesMap.set('550e8400-e29b-41d4-a716-446655440005', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440005',
        role: 'user',
        content: 'How important is QB pocket presence in today\'s NFL?',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440005',
        role: 'assistant',
        content: 'Pocket presence remains crucial despite the rise of mobile QBs. Elite quarterbacks know how to subtly slide within the pocket to buy extra time while keeping their eyes downfield. The best ones have an internal clock and feel pressure without seeing it. This skill often separates good QBs from great ones - it\'s why veterans like Brady and Manning excelled despite limited mobility.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Wide Receiver Routes
    messagesMap.set('550e8400-e29b-41d4-a716-446655440006', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440006',
        role: 'user',
        content: 'What route combinations are most effective against zone coverage?',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440006',
        role: 'assistant',
        content: 'Against zone coverage, the key is creating horizontal and vertical stretches. The "Flood" concept with three receivers at different levels is highly effective. Combining deep digs with underneath crossers creates natural windows in the zones. Many teams also use "Smash-7" routes where receivers sit down in the soft spots between zones. The timing between QB and receiver is crucial for exploiting these windows.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Offensive Line Formations
    messagesMap.set('550e8400-e29b-41d4-a716-446655440007', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440007',
        role: 'user',
        content: 'How are offensive lines adapting to handle modern pass rush schemes?',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440007',
        role: 'assistant',
        content: 'Modern O-lines are using more "Big on Big" protection schemes to handle complex pressures. Slide protection has become the norm, allowing the line to work as a unit. Teams are also keeping TEs and RBs in to help more frequently. The emphasis has shifted from individual matchups to collective protection, with centers making more pre-snap calls to identify potential threats.',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    // Special Teams Strategy
    messagesMap.set('550e8400-e29b-41d4-a716-446655440008', [
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440008',
        role: 'user',
        content: 'What special teams strategies are teams using to gain field position advantages?',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440008',
        role: 'assistant',
        content: 'Field position has become a chess match. Teams are using more directional punting to pin opponents deep, and "sky kicks" on kickoffs to limit returns while maximizing hang time. The new fair catch rule on kickoffs has changed strategies significantly. Some teams are also investing heavily in punt return schemes, using designed returns more frequently to create big plays.',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ])
    
    return messagesMap
  }

  const [threads, setThreads] = useState<Thread[]>(generateFakeThreads())
  const [messages, setMessages] = useState<Map<string, Message[]>>(generateFakeMessages())
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(conversationId || null)
  const [fieldDiagramOpenForMessage, setFieldDiagramOpenForMessage] = useState<string | null>(null)
  const [fieldDiagramMode, setFieldDiagramMode] = useState<'sidebar' | 'large' | 'fullscreen'>('sidebar')
  const [isMobile, setIsMobile] = useState(false)
  const [mainAreaWidth, setMainAreaWidth] = useState(window.innerWidth)
  const mainAreaRef = useRef<HTMLDivElement>(null)
  const [currentPlayDescription, setCurrentPlayDescription] = useState<string>('')
  
  // Sync with URL params
  useEffect(() => {
    if (conversationId && threads.find(t => t.id === conversationId)) {
      setSelectedThreadId(conversationId)
    } else if (!conversationId) {
      setSelectedThreadId(null)
    }
  }, [conversationId, threads])
  
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

  const selectedThread = threads.find(t => t.id === selectedThreadId)
  const threadMessages = selectedThreadId ? (messages.get(selectedThreadId) || []) : []

  const handleNewThread = () => {
    const newThread: Thread = {
      id: uuidv4(),
      title: 'New Thread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        sport: 'nfl'
      }
    }
    setThreads([newThread, ...threads])
    setSelectedThreadId(newThread.id)
    // Navigate to new thread URL
    navigate(`/t/${newThread.id}`)
    // Close sidebar on mobile when creating new thread
    if (sidebar.isMobile) {
      sidebar.setOpenMobile(false)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!selectedThreadId) return

    const userMessage: Message = {
      id: uuidv4(),
      threadId: selectedThreadId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }

    // Demo response - always show the field diagram
    const aiMessage: Message = {
      id: uuidv4(),
      threadId: selectedThreadId,
      role: 'assistant',
      content: 'I\'ll show you the moment Cooper DeJean intercepted Patrick Mahomes\' pass - a pivotal play from the Chiefs vs Eagles game. Click the button below to see the exact player positions at the moment of the interception.',
      timestamp: new Date().toISOString(),
      simulation: {
        id: '770e8400-e29b-41d4-a716-446655440001',
        type: 'play',
        displayTitle: 'DeJean INT Return - 70 yards'
      }
    }

    // Update messages map
    const updatedMessages = new Map(messages)
    const currentMessages = updatedMessages.get(selectedThreadId) || []
    updatedMessages.set(selectedThreadId, [...currentMessages, userMessage, aiMessage])
    setMessages(updatedMessages)

    // Update thread metadata
    setThreads(threads.map(thread => {
      if (thread.id === selectedThreadId) {
        return {
          ...thread,
          updatedAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          title: currentMessages.length === 0 ? content.substring(0, 30) + '...' : thread.title
        }
      }
      return thread
    }))
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
  
  const handleSelectThread = (id: string) => {
    if (id === '') {
      // Logo clicked - go to home
      setSelectedThreadId(null)
      navigate('/')
    } else {
      setSelectedThreadId(id)
      navigate(`/t/${id}`)
    }
    // Close simulation when selecting a different thread
    setFieldDiagramOpenForMessage(null)
  }

  return (
    <>
      <AppSidebarChat 
        threads={threads}
        selectedId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
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
                    {selectedThread && (
                      <h2 className="text-lg font-semibold text-foreground">
                        {selectedThread.title}
                      </h2>
                    )}
                  </header>

                  {/* Chat Content */}
                  {selectedThread ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1">
                        {threadMessages.length > 0 && (
                          <ChatMessages
                            messages={threadMessages}
                            onToggleFieldDiagram={handleToggleFieldDiagram}
                            fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
                            currentPlayDescription={currentPlayDescription}
                          />
                        )}
                      </div>

                      {/* Input */}
                      <ChatInput onSendMessage={handleSendMessage} />
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center p-8">
                      <div className="max-w-2xl text-center">
                        <h1 className="mb-4 text-4xl font-bold text-foreground">
                          Welcome to SportsGPT
                        </h1>
                        <p className="mb-8 text-lg text-muted-foreground">
                          Analyze NFL plays with AI-powered insights and interactive 3D visualizations
                        </p>
                        
                        <div className="mb-8 grid gap-4 text-left md:grid-cols-2">
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">🏈 Interactive Play Analysis</h3>
                            <p className="text-sm text-muted-foreground">
                              Explore every angle of crucial plays with our 3D field visualization
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">📊 Player Tracking</h3>
                            <p className="text-sm text-muted-foreground">
                              Follow individual player movements and see separation distances in real-time
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">🎯 Formation Insights</h3>
                            <p className="text-sm text-muted-foreground">
                              Understand offensive and defensive formations with expert AI analysis
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">⚡ Real Game Data</h3>
                            <p className="text-sm text-muted-foreground">
                              Analyze actual plays from NFL games with precise player positioning
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleNewThread}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4" />
                          Start New Analysis
                        </button>
                      </div>
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
                    <FieldViewer key={`field-${fieldDiagramMode}`} onPlayDescriptionChange={setCurrentPlayDescription} />
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
                  {selectedThread && (
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedThread.title}
                    </h2>
                  )}
                </header>

                {/* Chat Content */}
                {selectedThread ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1">
                      {threadMessages.length > 0 && (
                        <ChatMessages
                          messages={threadMessages}
                          onToggleFieldDiagram={handleToggleFieldDiagram}
                          fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
                          currentPlayDescription={currentPlayDescription}
                        />
                      )}
                    </div>

                    {/* Input */}
                    <ChatInput onSendMessage={handleSendMessage} />
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-8">
                    <div className="max-w-2xl text-center">
                      <h1 className="mb-4 text-4xl font-bold text-foreground">
                        Welcome to SportsGPT
                      </h1>
                      <p className="mb-8 text-lg text-muted-foreground">
                        Analyze NFL plays with AI-powered insights and interactive 3D visualizations
                      </p>
                      
                      <div className="mb-8 grid gap-4 text-left md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-4">
                          <h3 className="mb-2 text-lg font-semibold text-foreground">🏈 Interactive Play Analysis</h3>
                          <p className="text-sm text-muted-foreground">
                            Explore every angle of crucial plays with our 3D field visualization
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4">
                          <h3 className="mb-2 text-lg font-semibold text-foreground">📊 Player Tracking</h3>
                          <p className="text-sm text-muted-foreground">
                            Follow individual player movements and see separation distances in real-time
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4">
                          <h3 className="mb-2 text-lg font-semibold text-foreground">🎯 Formation Insights</h3>
                          <p className="text-sm text-muted-foreground">
                            Understand offensive and defensive formations with expert AI analysis
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4">
                          <h3 className="mb-2 text-lg font-semibold text-foreground">⚡ Real Game Data</h3>
                          <p className="text-sm text-muted-foreground">
                            Analyze actual plays from NFL games with precise player positioning
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleNewThread}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                        Start New Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SidebarInset>

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
            <FieldViewer onPlayDescriptionChange={setCurrentPlayDescription} />
          </div>
        </div>
      )}
    </>
  )
}

export default function ChatInterfaceInset() {
  return (
    <SidebarProvider defaultOpen={true}>
      <ChatInterfaceContent />
    </SidebarProvider>
  )
}