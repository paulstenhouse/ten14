import { Conversation } from '../../types/chat'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { NavUser } from './NavUser'

interface ConversationSidebarProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

export default function ConversationSidebar({
  conversations,
  selectedId,
  onSelectConversation,
  onNewConversation
}: ConversationSidebarProps) {
  // Demo user data
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    avatar: undefined
  }

  return (
    <div className="flex h-full w-[260px] flex-col border-r border-border bg-zinc-950">
      <div className="border-b border-border p-4">
        <Button
          onClick={onNewConversation}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {conversations.map(conversation => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "w-full rounded-md px-3 py-2.5 text-left transition-colors",
              "hover:bg-accent",
              selectedId === conversation.id && "bg-accent"
            )}
          >
            <div className="mb-1 truncate text-sm font-medium text-foreground">
              {conversation.title}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) + '...'
                : 'No messages'
              }
            </div>
            <div className="mt-1 text-xs text-muted-foreground/60">
              {new Date(conversation.updatedAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
      
      <NavUser user={user} />
    </div>
  )
}