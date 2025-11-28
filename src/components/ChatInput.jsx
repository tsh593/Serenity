// src/components/ChatInput.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import '../styles/ChatInput.css';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sttStatus, setSttStatus] = useState('disabled'); // Changed to disabled

  // TEMPORARILY DISABLE STT INITIALIZATION
  useEffect(() => {
    console.log('🎤 STT temporarily disabled - focus on fixing TTS first');
    setSttStatus('disabled');
    
    // Comment out STT initialization until TTS is working
    /*
    const initializeSTT = async () => {
      console.log('🎤 Initializing Speechmatics STT...');
      
      const connected = await speechmaticsSTT.initialize({
        onTranscript: (text, type) => {
          console.log(`📝 ${type} transcript:`, text);
          if (type === 'final') {
            setTranscript(prev => prev + ' ' + text);
          } else {
            setTranscript(text);
          }
        }
      });

      setSttStatus(connected ? 'connected' : 'error');
    };

    initializeSTT();

    return () => {
      speechmaticsSTT.stop();
    };
    */
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = input.trim() || transcript.trim();
    if (message && !disabled) {
      onSendMessage(message);
      setInput('');
      setTranscript('');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (transcript.trim()) {
        setInput(transcript.trim());
      }
    } else {
      // Start recording - TEMPORARILY DISABLED
      console.log('🎤 Voice recording temporarily disabled - fix TTS first');
      alert('Voice input temporarily disabled. Please type your message while we fix the TTS system.');
      
      // Re-enable this when STT is fixed:
      /*
      try {
        setTranscript('');
        await speechmaticsSTT.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        alert(`Recording failed: ${error.message}`);
      }
      */
    }
  };

  const getStatusDisplay = () => {
    switch (sttStatus) {
      case 'connected': return '🟢 Connected';
      case 'error': return '🔴 Error';
      case 'disconnected': return '⚪ Disconnected';
      case 'disabled': return '⚪ Voice Input Disabled'; // New status
      default: return '❓ Unknown';
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="input-wrapper">
        
        {/* Voice Recording Button - TEMPORARILY DISABLED */}
        <button
          type="button"
          className={`voice-button ${isRecording ? 'recording' : ''} disabled`} // Always disabled for now
          onClick={toggleRecording}
          disabled={true} // Force disabled
          title="Voice input temporarily disabled - fixing TTS system"
        >
          {isRecording ? '🛑' : '🎤'}
          {isRecording && <div className="pulse-animation"></div>}
        </button>

        {/* Text Input */}
        <textarea
          className="chat-input"
          value={input} // Always use input, not transcript
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message... (Voice input temporarily disabled)"
          disabled={disabled}
          rows={1}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !input.trim()} // Only check input, not transcript
        >
          ➤
        </button>
      </form>

      {/* Status and Recording Indicators */}
      <div className="voice-status-container">
        <div className="stt-status">
          <small>Voice Input: {getStatusDisplay()}</small>
        </div>
        
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <span>Recording... Speak now</span>
          </div>
        )}

        <div className="info-notice">
          <small>🔧 Fixing TTS system - voice input temporarily disabled</small>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;