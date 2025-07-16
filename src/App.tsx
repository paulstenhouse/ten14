import ChatInterfaceInset from "./components/Chat/ChatInterfaceInset"
import { ThemeProvider } from "./contexts/ThemeContext"

export default function App() {
  return (
    <ThemeProvider>
      <ChatInterfaceInset />
    </ThemeProvider>
  )
}