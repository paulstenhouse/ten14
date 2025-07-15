import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')

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
    <div style={{
      padding: '16px',
      borderTop: '1px solid #333',
      backgroundColor: '#1a1a1a'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          style={{
            flex: 1,
            minHeight: '44px',
            maxHeight: '120px',
            padding: '10px 14px',
            backgroundColor: '#2a2a2a',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.5'
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: disabled || !message.trim() ? '#444' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = '#1d4ed8'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}