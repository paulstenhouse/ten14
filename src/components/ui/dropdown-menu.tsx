import * as React from "react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children, open, onOpenChange }: any) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) setIsOpen(open)
  }, [open])

  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen, onOpenChange })
      )}
    </div>
  )
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; isOpen?: boolean; setIsOpen?: any }
>(({ className, children, asChild, isOpen, setIsOpen, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : 'button'
  const triggerProps = {
    ...props,
    onClick: (e: any) => {
      props.onClick?.(e)
      setIsOpen?.(!isOpen)
    },
    'data-state': isOpen ? 'open' : 'closed',
  }

  if (asChild) {
    return React.cloneElement(children as any, triggerProps)
  }

  return (
    <Comp ref={ref} className={className} {...triggerProps}>
      {children}
    </Comp>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
    sideOffset?: number
    isOpen?: boolean
    setIsOpen?: any
    onOpenChange?: any
  }
>(({ className, align = "center", sideOffset = 4, side = "bottom", isOpen, setIsOpen, onOpenChange, ...props }, ref) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown-content]') && !target.closest('[data-state]')) {
        setIsOpen?.(false)
        onOpenChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen, onOpenChange])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      data-dropdown-content
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "absolute mt-1",
        side === "right" && "left-full top-0 ml-1",
        side === "left" && "right-full top-0 mr-1",
        side === "top" && "bottom-full mb-1",
        side === "bottom" && "top-full",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { setIsOpen?: any }
>(({ className, setIsOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={() => setIsOpen?.(false)}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
DropdownMenuGroup.displayName = "DropdownMenuGroup"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}