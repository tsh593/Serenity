import '../styles/ChatHistory.css'

const ChatHistory = ({ messages, isLoading }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="chat-history">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">✨</div>
            <h3>Welcome to your AI Avatar Experience</h3>
            <p>Start a conversation and watch the avatar come to life with emotions and animations!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isAssistant = message.type === 'assistant';
            const isUser = message.type === 'user';
            return (
              <div
                key={message.id}
                className={`message ${message.type} ${message.isError ? 'error' : ''} ${isAssistant ? 'elara' : ''}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-meta">
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                    {isAssistant && message.persona && (
                      <span className="message-persona">
                        {message.persona}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="message ai loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHistory