import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Thread, Message } from '@/types/chat'
import ChatMessages from './ChatMessagesTailwind'
import ChatInput from './ChatInputTailwind'
import FieldViewer from '../FieldViewer'
import { AppSidebarChat } from '@/components/app-sidebar-chat'
import { layoutConfig } from '@/config/layout'
import { ThreadDetails } from './ThreadDetails'
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
    
    // Yesterday's threads (from yesterday's calendar day)
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    
    // Order by most recent first
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Defense Formation Setup',
      createdAt: new Date(yesterday.getTime() + 21.5 * 60 * 60 * 1000).toISOString(), // Yesterday 9:30 PM
      updatedAt: new Date(yesterday.getTime() + 21.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['defense', 'formation', 'strategy'],
        sport: 'nfl'
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'DeJean Interception Analysis',
      createdAt: new Date(yesterday.getTime() + 19 * 60 * 60 * 1000).toISOString(), // Yesterday 7:00 PM
      updatedAt: new Date(yesterday.getTime() + 19 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(yesterday.getTime() + 19 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['interception', 'eagles', 'chiefs'],
        sport: 'nfl',
        teams: ['PHI', 'KC']
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Eagles Coverage Schemes',
      createdAt: new Date(yesterday.getTime() + 16.5 * 60 * 60 * 1000).toISOString(), // Yesterday 4:30 PM
      updatedAt: new Date(yesterday.getTime() + 16.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['coverage', 'defense', 'eagles'],
        sport: 'nfl',
        teams: ['PHI']
      }
    })
    
    threads.push({
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Chiefs Red Zone Offense',
      createdAt: new Date(yesterday.getTime() + 14.5 * 60 * 60 * 1000).toISOString(), // Yesterday 2:30 PM
      updatedAt: new Date(yesterday.getTime() + 14.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        tags: ['offense', 'red-zone', 'chiefs'],
        sport: 'nfl',
        teams: ['KC']
      }
    })
    
    // Last week's threads (3-7 days ago) - most recent first
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
    
    // Earlier threads (8+ days ago)
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
      createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
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
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440001',
        role: 'assistant',
        content: 'Cooper DeJean\'s interception was a masterclass in reading the quarterback. He baited Mahomes by initially showing coverage on the underneath route, then broke on the ball at the perfect moment. The 70-yard return completely shifted momentum - the Eagles went from defending in their own territory to having the ball in prime scoring position. This kind of play showcases elite instincts and film study paying off.',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 427,
            completionTokens: 156,
            totalTokens: 583
          },
          duration: 1248,
          model: 'claude-3-sonnet',
          estimatedCost: 0.0024,
          agents: [
            {
              tokens: 312,
              reasoning: `User is asking about Cooper DeJean's interception play. I need to:
1. Explain the defensive technique used
2. Highlight the impact on the game
3. Provide context about momentum shifts

Key points to cover:
- DeJean's baiting technique
- Reading Mahomes' eyes
- 70-yard return impact
- Momentum shift implications`,
              model: 'claude-3-haiku',
              duration: 523,
              cost: 0.0008
            }
          ]
        }
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440001',
        role: 'user',
        content: 'Can you show me the exact moment of the interception?',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 60000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440001',
        role: 'assistant',
        content: 'I\'ll show you the exact moment of the interception with all 22 players on the field. You can see how DeJean read Mahomes\' eyes and broke on the route perfectly.',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 90000).toISOString(),
        simulation: {
          id: '770e8400-e29b-41d4-a716-446655440001',
          type: 'play',
          displayTitle: 'DeJean INT - Moment of Catch'
        },
        metadata: {
          usage: {
            promptTokens: 156,
            completionTokens: 87,
            totalTokens: 243
          },
          duration: 645,
          model: 'gpt-4-turbo',
          estimatedCost: 0.0024,
          agents: [
            {
              tokens: 243,
              reasoning: `User wants to see the visualization of the interception play.
              
Actions needed:
1. Load the simulation data for the DeJean interception
2. Set up the 3D visualization at the moment of the catch
3. Highlight DeJean and the ball trajectory

The simulation will show all 22 players with DeJean's positioning and route break.`,
              model: 'gpt-3.5-turbo',
              duration: 345,
              cost: 0.0012
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 523,
            completionTokens: 189,
            totalTokens: 712
          },
          duration: 2156,
          model: 'gpt-4-turbo',
          estimatedCost: 0.0089,
          agents: [
            {
              tokens: 245,
              reasoning: `Analyzing Chiefs red zone performance query. Need to gather:
- Statistical data on red zone efficiency
- Key factors contributing to success
- Personnel and scheme advantages`,
              model: 'gpt-3.5-turbo',
              duration: 456,
              cost: 0.0012
            },
            {
              tokens: 467,
              reasoning: `Retrieved stats showing 68% TD conversion rate. Key insights:
- Andy Reid's play design in compressed spaces
- Mahomes' ability to extend plays with legs
- Travis Kelce's route running in tight windows
- RPO usage creating defensive conflicts

Will synthesize into comprehensive response.`,
              model: 'gpt-4',
              duration: 1700,
              cost: 0.0077
            }
          ]
        }
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440002',
        role: 'user',
        content: 'Show me their most successful red zone play from last game',
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000 + 45000).toISOString()
      },
      {
        id: uuidv4(),
        threadId: '550e8400-e29b-41d4-a716-446655440002',
        role: 'assistant',
        content: 'Here\'s the Chiefs\' touchdown play from the 4-yard line against the Eagles. Notice how they use motion to create a pick play for Kelce, while Mahomes has the RPO option if the linebacker crashes down.',
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000 + 75000).toISOString(),
        simulation: {
          id: '770e8400-e29b-41d4-a716-446655440002',
          type: 'play',
          displayTitle: 'Chiefs RZ TD - Kelce 4yd'
        },
        metadata: {
          usage: {
            promptTokens: 198,
            completionTokens: 112,
            totalTokens: 310
          },
          duration: 1123,
          model: 'claude-3-sonnet',
          estimatedCost: 0.0019,
          agents: [
            {
              tokens: 310,
              reasoning: `User requesting visualization of successful red zone play.

Selecting the Kelce touchdown from 4-yard line:
- Shows motion creating picks
- Demonstrates RPO concept
- Highlights red zone efficiency
- Good example of Chiefs' scheme in compressed space

Will load simulation with focus on pre-snap motion and route development.`,
              model: 'claude-3-haiku',
              duration: 423,
              cost: 0.0008
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 387,
            completionTokens: 142,
            totalTokens: 529
          },
          duration: 1856,
          model: 'claude-3-opus',
          estimatedCost: 0.0079,
          agents: [
            {
              tokens: 287,
              reasoning: `User asking about defensive formations against modern offenses. Key analysis points:
- Base defensive packages evolution
- Personnel groupings (nickel/dime)
- Coverage disguises and rotations
- Pressure schemes

Need to explain the shift from traditional 4-3/3-4 to more DB-heavy packages due to passing game evolution.`,
              model: 'claude-3-opus',
              duration: 892,
              cost: 0.0043
            },
            {
              tokens: 242,
              reasoning: `Additional context on Big Nickel package:
- Hybrid safety/linebacker role
- Allows flexibility vs run/pass
- Popular with teams like Ravens, Steelers
- Simulated pressures create confusion without committing to blitz`,
              model: 'claude-3-sonnet',
              duration: 964,
              cost: 0.0036
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 412,
            completionTokens: 168,
            totalTokens: 580
          },
          duration: 2347,
          model: 'gpt-4',
          estimatedCost: 0.0174,
          agents: [
            {
              tokens: 580,
              reasoning: `Analyzing Eagles defensive scheme effectiveness. Research shows:
1. Pre-snap disguise rate: ~40% coverage rotation
2. Press-man coverage enabling safety help
3. Veteran additions (Bradberry, CJGJ) improving communication
4. Complex schemes require elite execution

Their success comes from:
- Personnel talent at CB position
- Safety versatility (can play high or in box)
- Excellent defensive coordinator (Jonathan Gannon)
- Practice time invested in disguises`,
              model: 'gpt-4',
              duration: 2347,
              cost: 0.0174
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 298,
            completionTokens: 124,
            totalTokens: 422
          },
          duration: 954,
          model: 'claude-3-sonnet',
          estimatedCost: 0.0015,
          agents: [
            {
              tokens: 422,
              reasoning: `QB pocket presence analysis request. Key elements to address:
- Importance hasn't diminished with mobile QB trend
- Subtle movements vs scrambling
- Internal clock development
- Eyes downfield principle
- Examples: Brady, Manning success

This is fundamental QB skill that transcends athleticism.`,
              model: 'claude-3-sonnet',
              duration: 954,
              cost: 0.0015
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 456,
            completionTokens: 187,
            totalTokens: 643
          },
          duration: 2789,
          model: 'gpt-4-turbo',
          estimatedCost: 0.0083,
          agents: [
            {
              tokens: 234,
              reasoning: `Zone coverage beating concepts analysis:
- Flood routes (3 levels vertical stretch)
- Dig/Crosser combinations
- Smash-7 (spot routes)

Need to explain the geometry and timing aspects.`,
              model: 'gpt-3.5-turbo',
              duration: 467,
              cost: 0.0012
            },
            {
              tokens: 409,
              reasoning: `Detailed route concepts vs zone:
1. Flood - Hi/Mid/Low triangle stretch
2. Dig concept - 15-18 yard in-breakers
3. Crossers - horizontal stretch underneath
4. Smash-7 - Corner/Quick game combo
5. Spacing concepts - 5 receivers across

Timing is critical - ball must arrive as receiver enters window before zone defenders can react.`,
              model: 'gpt-4-turbo',
              duration: 2322,
              cost: 0.0071
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 512,
            completionTokens: 176,
            totalTokens: 688
          },
          duration: 1623,
          model: 'claude-3-opus',
          estimatedCost: 0.0103,
          agents: [
            {
              tokens: 356,
              reasoning: `O-line adaptation to modern pass rush:
- Big on Big (5 OL take 5 most dangerous)
- Slide protection prevalence
- 6-7 man protections more common
- Center as QB of OL

This reflects defensive evolution with more exotic pressures and simulated looks.`,
              model: 'claude-3-haiku',
              duration: 423,
              cost: 0.0009
            },
            {
              tokens: 332,
              reasoning: `Additional protection scheme details:
- Vertical sets vs traditional kick-slide
- Combo blocks transitioning to LBs
- RB check-release rules
- Hot routes vs unblocked defenders
- Communication systems (alerts, calls)

Modern game requires more mental processing pre-snap.`,
              model: 'claude-3-opus',
              duration: 1200,
              cost: 0.0094
            }
          ]
        }
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
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
        metadata: {
          usage: {
            promptTokens: 478,
            completionTokens: 165,
            totalTokens: 643
          },
          duration: 2934,
          model: 'gpt-4',
          estimatedCost: 0.0193,
          agents: [
            {
              tokens: 298,
              reasoning: `Special teams strategy analysis focusing on field position battle:
1. Directional punting trends
2. Sky kicks on kickoffs
3. New fair catch rule impact
4. Designed punt returns

Need to explain how these strategies affect game outcomes.`,
              model: 'gpt-4',
              duration: 1456,
              cost: 0.0089
            },
            {
              tokens: 345,
              reasoning: `Deeper analysis of special teams evolution:
- Coffin corner punts vs rugby style
- Hang time metrics (4.5+ seconds ideal)
- Fair catch at 25 yard line rule
- Wall returns vs traditional wedge
- Analytics driving 4th down decisions

Field position correlation with winning percentage is stronger than ever.`,
              model: 'gpt-4',
              duration: 1478,
              cost: 0.0104
            }
          ]
        }
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
  
  // Calculate minimum panel size as percentage
  const minPanelPercentage = Math.max(35, (layoutConfig.minPanelWidth / mainAreaWidth) * 100)
  
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
    const responseStartTime = Date.now()
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
      },
      metadata: {
        usage: {
          promptTokens: Math.floor(Math.random() * 500) + 300,
          completionTokens: Math.floor(Math.random() * 200) + 100,
          totalTokens: 0 // Will calculate below
        },
        duration: Math.floor(Math.random() * 2000) + 800, // 0.8-2.8s
        model: 'gpt-4-turbo',
        estimatedCost: 0, // Will calculate below
        agents: [
          {
            tokens: Math.floor(Math.random() * 300) + 200,
            reasoning: `Analyzing user query for NFL play request...
            
User is asking about a specific play visualization. Based on the context:
- They want to see Cooper DeJean's interception
- This is from the Chiefs vs Eagles game
- The interception was returned for 70 yards
- This was a pivotal moment in the game

I should provide:
1. A brief explanation of the play
2. Access to the 3D visualization
3. Context about why this play was significant

The simulation data is available for play ID 770e8400-e29b-41d4-a716-446655440001.`,
            model: 'gpt-4',
            duration: Math.floor(Math.random() * 800) + 400,
            cost: Math.random() * 0.02 + 0.01
          }
        ]
      }
    }
    
    // Calculate totals
    aiMessage.metadata!.usage!.totalTokens = 
      aiMessage.metadata!.usage!.promptTokens! + aiMessage.metadata!.usage!.completionTokens!
    aiMessage.metadata!.estimatedCost = 
      (aiMessage.metadata!.usage!.promptTokens! * 0.00003) + 
      (aiMessage.metadata!.usage!.completionTokens! * 0.00006)

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

  const handleDeleteThread = (id: string) => {
    // Remove thread from list
    setThreads(threads.filter(t => t.id !== id))
    
    // Remove associated messages
    const newMessages = new Map(messages)
    newMessages.delete(id)
    setMessages(newMessages)
    
    // If deleting the current thread, navigate to home
    if (selectedThreadId === id) {
      setSelectedThreadId(null)
      navigate('/')
    }
  }

  return (
    <>
      <AppSidebarChat 
        threads={threads}
        selectedId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        onDeleteThread={handleDeleteThread}
        className={isMobile ? 'z-40' : ''}
      />
      <SidebarInset className="overflow-hidden" ref={mainAreaRef}>
          {fieldDiagramOpenForMessage && fieldDiagramMode !== 'fullscreen' && !isMobile && mainAreaWidth >= 650 ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={minPanelPercentage}>
                {/* Chat Section */}
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <header className="relative flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px]">
                    <SidebarTrigger className="text-foreground" />
                    <Separator orientation="vertical" className="h-6" />
                    {selectedThread && (
                      <>
                        <h2 className="text-lg font-semibold text-foreground flex-1">
                          {selectedThread.title}
                        </h2>
                        <ThreadDetails 
                          thread={selectedThread} 
                          messages={threadMessages}
                        />
                      </>
                    )}
                  </header>

                  {/* Chat Content */}
                  {selectedThread ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1 flex justify-center">
                          <div className="w-full" style={{ maxWidth: layoutConfig.chatContentMaxWidth }}>
                            {threadMessages.length > 0 && (
                              <ChatMessages
                                messages={threadMessages}
                                onToggleFieldDiagram={handleToggleFieldDiagram}
                                fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
                                currentPlayDescription={currentPlayDescription}
                              />
                            )}
                          </div>
                        </div>

                        {/* Input */}
                        <ChatInput onSendMessage={handleSendMessage} />
                      </div>
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
              
              <ResizablePanel defaultSize={50} minSize={minPanelPercentage}>
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
                <header className="relative flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px]">
                  <SidebarTrigger className="text-foreground" />
                  <Separator orientation="vertical" className="h-6" />
                  {selectedThread && (
                    <>
                      <h2 className="text-lg font-semibold text-foreground flex-1">
                        {selectedThread.title}
                      </h2>
                      <ThreadDetails 
                        thread={selectedThread} 
                        messages={threadMessages}
                      />
                    </>
                  )}
                </header>

                {/* Chat Content */}
                {selectedThread ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 flex justify-center">
                        <div className="w-full" style={{ maxWidth: layoutConfig.chatContentMaxWidth }}>
                          {threadMessages.length > 0 && (
                            <ChatMessages
                              messages={threadMessages}
                              onToggleFieldDiagram={handleToggleFieldDiagram}
                              fieldDiagramOpenForMessage={fieldDiagramOpenForMessage}
                              currentPlayDescription={currentPlayDescription}
                            />
                          )}
                        </div>
                      </div>

                      {/* Input */}
                      <ChatInput onSendMessage={handleSendMessage} />
                    </div>
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