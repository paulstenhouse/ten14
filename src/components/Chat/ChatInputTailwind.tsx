import { useState, KeyboardEvent } from 'react'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          disabled={disabled}
          className={`flex-1 resize-none rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-gray-300 dark:focus:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out ${
            isFocused ? 'min-h-[88px]' : 'min-h-[44px]'
          } max-h-[120px]`}
          style={{
            height: isFocused ? '88px' : '44px'
          }}
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="icon"
          className="h-[44px] w-[44px]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}