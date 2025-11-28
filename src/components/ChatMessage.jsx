// src/components/ChatMessage.jsx - IMPROVED VERSION
import React from 'react';
import '../styles/ChatMessage.css';

const ChatMessage = ({ role, content, timestamp, emotion, persona = 'Dr. Elara' }) => {
  const isUser = role === 'user';
  
  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced gender-aware sender names
  const getSenderName = () => {
    if (isUser) return 'You';
    
    // More robust persona detection
    const normalizedPersona = persona?.toString().toLowerCase() || '';
    
    if (normalizedPersona.includes('theo')) {
      return 'Dr. Theo 👨‍⚕️';
    }
    
    // Default to Dr. Elara for female
    return 'Dr. Elara 👩‍⚕️';
  };

  // Emotion display
  const getEmotionDisplay = () => {
    if (isUser || !emotion) return null;
    
    const emotionEmojis = {
      'neutral': '😐',
      'joyful': '😊',
      'sad': '😢',
      'angry': '😠',
      'surprised': '😲',
      'thoughtful': '🤔',
      'scared': '😨',
      'excited': '🎉',
      'concerned': '😟',
      'explain': '💡',
      'smile': '😄',
      'revulsed': '🤢',
      'fearful': '😰',
      'shocked': '😱',
      'empathetic': '💝',
      'thinking': '🧠'
    };
    
    const emoji = emotionEmojis[emotion] || '💬';
    return <span className="emotion-indicator">{emoji}</span>;
  };

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-header">
        <div className="sender-info">
          <span className="message-sender">{getSenderName()}</span>
          {getEmotionDisplay()}
        </div>
        <span className="message-timestamp">{formatTimestamp(timestamp)}</span>
      </div>
      <div className="message-content">
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;