"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  tokenUsage?: {
    used: number
    total: number
  }
}

export function NavUser({
  user,
  tokenUsage = { used: 250000, total: 1000000 } // Default demo values
}: NavUserProps) {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()
  
  // Calculate usage percentage
  const usagePercentage = (tokenUsage.used / tokenUsage.total) * 100
  const remainingTokens = tokenUsage.total - tokenUsage.used
  
  // Format large numbers
  const formatTokens = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toLocaleString()
  }
  
  // Get user initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-3">
      {/* Token usage progress - independent */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Tokens</span>
          <span className="text-xs text-muted-foreground">
            {formatTokens(tokenUsage.total)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1 mb-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTokens(tokenUsage.used)} Used • {Math.round(usagePercentage)}%
        </div>
      </div>
      
      {/* User dropdown */}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-border/50 hover:border-border"
              >
                <Avatar className="h-8 w-8">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-medium text-sm">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">Subscriber</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">Subscriber</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="size-4 mr-2" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="size-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="size-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="size-4 mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="size-4 mr-2" />
                <span>Light</span>
                {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="size-4 mr-2" />
                <span>Dark</span>
                {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    </div>
  )
}
