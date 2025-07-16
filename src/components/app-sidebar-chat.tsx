import * as React from "react"
import { Plus } from "lucide-react"
import { Thread } from "@/types/chat"
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
  threads: Thread[]
  selectedId: string | null
  onSelectThread: (id: string) => void
  onNewThread: () => void
}

// Helper function to calculate time ago
function getTimeAgo(date: string): string {
  const now = new Date()
  const dateObj = new Date(date)
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
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

// Helper function to group threads by time period
function groupThreadsByTime(threads: Thread[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const groups: { [key: string]: Thread[] } = {
    'Today': [],
    'Yesterday': [],
    'Last Week': [],
    'Earlier': []
  }
  
  threads.forEach(thread => {
    const threadDate = new Date(thread.updatedAt)
    if (threadDate >= today) {
      groups['Today'].push(thread)
    } else if (threadDate >= yesterday) {
      groups['Yesterday'].push(thread)
    } else if (threadDate >= lastWeek) {
      groups['Last Week'].push(thread)
    } else {
      groups['Earlier'].push(thread)
    }
  })
  
  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) delete groups[key]
  })
  
  return groups
}

export function AppSidebarChat({ 
  threads,
  selectedId,
  onSelectThread,
  onNewThread,
  ...props 
}: AppSidebarChatProps) {
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: undefined
  }
  
  const groupedThreads = groupThreadsByTime(threads)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div 
          className="flex flex-col items-start px-1 pt-2 mb-2 cursor-pointer"
          onClick={() => onSelectThread('')}
        >
          <img 
            src="https://sportgpt.pages.dev/assets/ten14logo-AuV9iT5b.png" 
            alt="Ten14 Logo" 
            className="w-[125px] h-auto"
          />
          <span className="text-lg font-semibold">SportsGPT</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onNewThread} className="w-full justify-start">
              <Plus className="size-4" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groupedThreads).map(([period, threadList]) => (
          <SidebarGroup key={period}>
            <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground">
              {period}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {threadList.map(thread => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectThread(thread.id)}
                    isActive={selectedId === thread.id}
                    tooltip={thread.title}
                    className="w-full justify-start h-auto py-2 px-4"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="truncate text-sm">
                        {thread.title}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {getTimeAgo(thread.updatedAt)}
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