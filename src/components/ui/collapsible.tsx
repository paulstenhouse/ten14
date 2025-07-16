import * as React from "react"

const CollapsibleContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

const Collapsible = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
    asChild?: boolean
  }
>(({ children, open: openProp, onOpenChange, defaultOpen = false, asChild, ...props }, ref) => {
  const [open, setOpen] = React.useState(openProp ?? defaultOpen)

  React.useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  const handleSetOpen = (value: boolean) => {
    setOpen(value)
    onOpenChange?.(value)
  }

  if (asChild) {
    return (
      <CollapsibleContext.Provider value={{ open, setOpen: handleSetOpen }}>
        {children}
      </CollapsibleContext.Provider>
    )
  }

  return (
    <CollapsibleContext.Provider value={{ open, setOpen: handleSetOpen }}>
      <div ref={ref} data-state={open ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, onClick, ...props }, ref) => {
  const { setOpen, open } = React.useContext(CollapsibleContext)
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setOpen(!open)
  }

  if (asChild) {
    return React.cloneElement(children as any, {
      onClick: handleClick,
      'data-state': open ? 'open' : 'closed',
      ...props
    })
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      data-state={open ? "open" : "closed"}
      {...props}
    >
      {children}
    </button>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext)
  
  if (!open) return null
  
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }