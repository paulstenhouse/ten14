import * as React from "react"
import { Plus } from "lucide-react"
import { Conversation } from "@/types/chat"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarChatProps extends React.ComponentProps<typeof Sidebar> {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

// Helper function to group conversations by time period
function groupConversationsByTime(conversations: Conversation[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const groups: { [key: string]: Conversation[] } = {
    'Today': [],
    'Yesterday': [],
    'Last Week': [],
    'Earlier': []
  }
  
  conversations.forEach(conv => {
    const convDate = new Date(conv.updatedAt)
    if (convDate >= today) {
      groups['Today'].push(conv)
    } else if (convDate >= yesterday) {
      groups['Yesterday'].push(conv)
    } else if (convDate >= lastWeek) {
      groups['Last Week'].push(conv)
    } else {
      groups['Earlier'].push(conv)
    }
  })
  
  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) delete groups[key]
  })
  
  return groups
}

export function AppSidebarChat({ 
  conversations,
  selectedId,
  onSelectConversation,
  onNewConversation,
  ...props 
}: AppSidebarChatProps) {
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: undefined
  }
  
  const groupedConversations = groupConversationsByTime(conversations)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-start px-1 pt-2 mb-2">
          <img 
            src="https://sportgpt.pages.dev/assets/ten14logo-AuV9iT5b.png" 
            alt="Ten14 Logo" 
            className="w-[125px] h-auto"
          />
          <span className="text-lg font-semibold">SportsGPT</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onNewConversation} className="w-full justify-start">
              <Plus className="size-4" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groupedConversations).map(([period, convs]) => (
          <SidebarGroup key={period}>
            <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground">
              {period}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {convs.map(conversation => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectConversation(conversation.id)}
                    isActive={selectedId === conversation.id}
                    tooltip={conversation.title}
                    className="w-full justify-start h-auto py-2 px-4"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="truncate text-sm">
                        {conversation.title}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {getTimeAgo(new Date(conversation.updatedAt))}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}