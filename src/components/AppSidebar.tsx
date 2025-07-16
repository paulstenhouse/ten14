import * as React from "react"
import { Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { NavUser } from "./Chat/NavUser"
import { cn } from "../lib/utils"
import { Conversation } from "../types/chat"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

export function AppSidebar({ 
  conversations,
  selectedId,
  onSelectConversation,
  onNewConversation,
  ...props 
}: AppSidebarProps) {
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    avatar: undefined
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              onClick={onNewConversation}
              className="w-full"
            >
              <Plus className="h-5 w-5" />
              <span className="group-data-[state=closed]:hidden">New Conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {conversations.map(conversation => (
              <SidebarMenuItem key={conversation.id}>
                <SidebarMenuButton
                  onClick={() => onSelectConversation(conversation.id)}
                  isActive={selectedId === conversation.id}
                  className="w-full justify-start"
                  tooltip={conversation.title}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-primary-foreground group-data-[state=open]:hidden">
                    {conversation.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex w-full flex-col items-start group-data-[state=closed]:hidden">
                    <div className="truncate text-sm font-medium">
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
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}