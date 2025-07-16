# SportsGPT Layout Architecture

## Visual Layout Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AppShell                                        │
│ ┌─────────────┬───────────────────────────────────────────────────────────┐ │
│ │             │                    ContentArea                             │ │
│ │             │ ┌───────────────────────────────────────────────────────┐ │ │
│ │             │ │                    Main                                │ │ │
│ │             │ │ ┌─────────────────────────────────────────────────────┐│ │
│ │             │ │ │               MainHeader                             ││ │
│ │             │ │ │ [≡] | Thread Title                                  ││ │
│ │             │ │ └─────────────────────────────────────────────────────┘│ │
│ │ Navigation  │ │ ┌─────────────────────────────────────────────────────┐│ │
│ │  Sidebar    │ │ │               MainContent                            ││ │
│ │             │ │ │  ┌─────────────────────────────────────────────┐   ││ │
│ │ ┌─────────┐ │ │ │  │       ContentWrapper (750px max)           │   ││ │
│ │ │  Logo   │ │ │ │  │                                             │   ││ │
│ │ │SportsGPT│ │ │ │  │          Chat Messages                      │   ││ │
│ │ └─────────┘ │ │ │  │              or                              │   ││ │
│ │ ┌─────────┐ │ │ │  │         Welcome View                        │   ││ │
│ │ │New Chat │ │ │ │  │                                             │   ││ │
│ │ └─────────┘ │ │ │  └─────────────────────────────────────────────┘   ││ │
│ │             │ │ └─────────────────────────────────────────────────────┘│ │
│ │  Yesterday  │ │ ┌─────────────────────────────────────────────────────┐│ │
│ │ • Thread 1  │ │ │               MainFooter (100% width)                ││ │
│ │ • Thread 2  │ │ │  ┌─────────────────────────────────────────────┐   ││ │
│ │             │ │ │  │       FooterContent (750px max)            │   ││ │
│ │  Last Week  │ │ │  │  [Type your message...              ] [➤]  │   ││ │
│ │ • Thread 3  │ │ │  └─────────────────────────────────────────────┘   ││ │
│ │             │ │ └─────────────────────────────────────────────────────┘│ │
│ │ ┌─────────┐ │ └───────────────────────────────────────────────────────┘ │ │
│ │ │User Info│ │                                                           │ │
│ │ └─────────┘ │                                                           │ │
│ └─────────────┴───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

With Aside Panel Open:
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AppShell                                        │
│ ┌─────────────┬────────────────────────────┬─────────────────────────────┐ │
│ │ Navigation  │          Main              │         Aside              │ │
│ │  Sidebar    │   (Resizable, min 325px)   │  (Resizable, min 325px)   │ │
│ │             │  • MainHeader               │  • AsideHeader             │ │
│ │             │  • MainContent              │  • AsideContent            │ │
│ │             │  • MainFooter               │    - SimulationViewer      │ │
│ │             │                             │    - VideoPlayer           │ │
│ │             │                             │    - DocumentViewer        │ │
│ │             │                             │    - etc.                  │ │
│ └─────────────┴────────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Proposed Component Names & Structure

### 1. **AppShell** (Root Layout Container)
   - Purpose: Main application wrapper that manages sidebar state
   - Current: `<SidebarProvider>`
   - Contains: Sidebar + ContentArea

### 2. **NavigationSidebar** 
   - Purpose: Left navigation panel with threads and user info
   - Current: `<AppSidebarChat>`
   - Sections:
     - `SidebarBrand` - Logo and app name
     - `SidebarActions` - New chat button
     - `ThreadList` - Grouped conversation threads
     - `UserProfile` - User info at bottom

### 3. **ContentArea**
   - Purpose: Main content container (right side)
   - Current: `<SidebarInset>`
   - Contains: Main + Aside (when simulation is open)

### 4. **Main**
   - Purpose: Primary content column (chat interface)
   - Structure:
     - `MainHeader` - Top bar with sidebar trigger and thread title
     - `MainContent` - Messages area (scrollable)
     - `MainFooter` - Input area

### 5. **MainHeader**
   - Purpose: Top bar with navigation and context
   - Current: `<header>` with SidebarTrigger
   - Components:
     - `MenuToggle` - Sidebar trigger button
     - `ThreadTitle` - Current thread name
     - `HeaderActions` - Future action buttons

### 6. **MainContent**
   - Purpose: Scrollable messages area or welcome view
   - Current: Flex container with messages or welcome screen
   - Structure:
     ```
     MainContent (flex-1, overflow-auto)
     └── ContentWrapper (max-width: 750px, centered)
         └── ChatMessages or WelcomeView
     ```

### 7. **MainFooter**
   - Purpose: Input area at bottom
   - Current: `<ChatInput>` component
   - Structure:
     ```
     MainFooter (100% width, border-top)
     └── FooterContent (max-width: 750px, centered)
         └── TextArea + SendButton
     ```

### 8. **Aside**
   - Purpose: Secondary content panel (flexible)
   - Current: Resizable panel or fullscreen overlay
   - Components:
     - `AsideHeader` - Context-specific controls
     - `AsideContent` - Dynamic content area
   - Content Types:
     - `SimulationViewer` - 3D field visualization
     - `VideoPlayer` - Game footage/replays (future)
     - `DocumentViewer` - PDFs, stats sheets (future)
     - `ImageGallery` - Play diagrams (future)
     - `DataTable` - Statistics view (future)
   - Modes:
     - Split view with Main
     - Fullscreen overlay

### 9. **WelcomeView**
   - Purpose: Empty state when no thread selected
   - Current: Welcome content with feature cards
   - Components:
     - `WelcomeHero` - Title and description
     - `FeatureGrid` - Feature cards
     - `CTAButton` - Start new analysis button

## CSS Class Naming Convention

### Current Issues:
- Long Tailwind class strings
- Repeated styling patterns
- Hard to maintain consistency

### Proposed Naming System:

```css
/* Layout Components */
.app-shell
.nav-sidebar
.content-area

/* Main Section */
.main
.main-header
.main-content
.main-footer

/* Aside Section */
.aside
.aside-header
.aside-content

/* Content Wrappers */
.content-wrapper /* max-width constraint wrapper */
.footer-content /* input area wrapper */

/* State Modifiers */
.--mobile
.--desktop
.--fullscreen
.--collapsed

/* Utility Classes */
.content-width-constraint /* max-width from config */
.border-divider /* border-t border-border */
```

## Configuration System

```typescript
// src/config/layout.ts
export const layoutConfig = {
  // Content width constraints
  chatContentMaxWidth: "750px", // "100%", "750px", "80%", etc.
  
  // Breakpoints
  mobileBreakpoint: 728,
  
  // Panel sizes
  minPanelWidth: 325, // Minimum width in pixels for main and aside panels
  defaultChatPanelSize: 50, // Default size as percentage
  defaultAsidePanelSize: 50, // Default size as percentage
  
  // Animation durations
  sidebarAnimationDuration: 300,
  inputExpandDuration: 300,
}
```

## Benefits of This Architecture:

1. **Clarity**: Each component has a single, clear purpose
2. **Flexibility**: Easy to change layout constraints via config
3. **Maintainability**: Consistent naming makes code easier to understand
4. **Responsiveness**: Clear mobile/desktop separation
5. **Scalability**: Easy to add new features or panels

## Aside Content System

The Aside panel is designed to be completely flexible and can display different types of content based on the message context:

```typescript
// Example message with different aside content types
interface Message {
  id: string
  content: string
  asideContent?: {
    type: 'simulation' | 'video' | 'document' | 'image' | 'data'
    data: any
    title?: string
    controls?: AsideControl[]
  }
}

// Aside would dynamically render based on content type
const AsideContent = ({ content }) => {
  switch (content.type) {
    case 'simulation':
      return <SimulationViewer data={content.data} />
    case 'video':
      return <VideoPlayer src={content.data.url} />
    case 'document':
      return <DocumentViewer document={content.data} />
    case 'image':
      return <ImageViewer images={content.data} />
    case 'data':
      return <DataTable data={content.data} />
  }
}
```

This architecture allows the app to evolve and support rich media content without changing the core layout structure.

## Implementation Priority:

1. Create layout config file ✅
2. Implement content width constraints ✅
3. Refactor component names to Main/Aside structure
4. Create flexible Aside content system
5. Create CSS utility classes for common patterns
6. Document component props and usage