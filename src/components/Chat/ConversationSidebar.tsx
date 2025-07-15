import { Conversation } from '../../types/chat'

interface ConversationSidebarProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

export default function ConversationSidebar({
  conversations,
  selectedId,
  onSelectConversation,
  onNewConversation
}: ConversationSidebarProps) {
  return (
    <div style={{
      width: '260px',
      backgroundColor: '#1a1a1a',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333'
      }}>
        <button
          onClick={onNewConversation}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2a2a2a',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3a3a3a'
            e.currentTarget.style.borderColor = '#555'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2a2a2a'
            e.currentTarget.style.borderColor = '#444'
          }}
        >
          + New Conversation
        </button>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            style={{
              padding: '12px',
              marginBottom: '4px',
              backgroundColor: selectedId === conversation.id ? '#2a2a2a' : 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (selectedId !== conversation.id) {
                e.currentTarget.style.backgroundColor = '#252525'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== conversation.id) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {conversation.title}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#888',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) + '...'
                : 'No messages'
              }
            </div>
            <div style={{
              fontSize: '11px',
              color: '#666',
              marginTop: '4px'
            }}>
              {new Date(conversation.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}