import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ChatInterfaceInset from "./components/Chat/ChatInterfaceInset"
import { ThemeProvider } from "./contexts/ThemeContext"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatInterfaceInset />} />
          <Route path="/t" element={<ChatInterfaceInset />} />
          <Route path="/t/:conversationId" element={<ChatInterfaceInset />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}