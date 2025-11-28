// src/pages/ChatPage.jsx - COMPLETE FIXED VERSION WITH ALL EMOTIONS
import React, { useState, useRef, useEffect } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import AvatarDisplay from '../components/AvatarDisplay';
import { generateSpeech, stopSpeech, isSpeechPlaying, pauseSpeech, resumeSpeech } from '../services/speechmaticsTtsService';
import { freesoundService } from '../services/freesoundService';
import { getAvatarConfig, getPersonaByVoice, voiceGenderMap, emotionAliases } from '../config/avatarConfig';
import '../styles/ChatPage.css';
import VideoBackground from '../components/VideoBackground';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3.1:8b');
  const [ollamaStatus, setOllamaStatus] = useState('checking');
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [showImage, setShowImage] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastAssistantMessageRef = useRef(null);
  
  // State for scroll detection
  const [userScrolled, setUserScrolled] = useState(false);

  // Get persona based on selected voice
  const [currentPersona, setCurrentPersona] = useState('Dr. Elara');

  // Emotion queue for sequential emotions
  const [emotionQueue, setEmotionQueue] = useState([]);
  const emotionTimeoutRef = useRef(null);

  // Sync sound gender with voice selection
  useEffect(() => {
    const gender = voiceGenderMap[selectedVoice];
    freesoundService.setGender(gender);
  }, [selectedVoice]);

  // Update persona when voice changes
  useEffect(() => {
    const persona = getPersonaByVoice(selectedVoice);
    setCurrentPersona(persona);
  }, [selectedVoice]);

  // Initialize Freesound service
  useEffect(() => {
    freesoundService.initialize();
  }, []);

  // --- EMOTION QUEUE LOGIC ---
  useEffect(() => {
    if (emotionQueue.length > 0 && !emotionTimeoutRef.current) {
      processNextEmotion();
    }
  }, [emotionQueue]);

  const processNextEmotion = () => {
    if (emotionQueue.length === 0) return;

    const nextEmotion = emotionQueue[0];
    console.log(`🎭 Processing emotion from queue: ${nextEmotion.emotion} for ${nextEmotion.duration}ms`);
    
    setCurrentEmotion(nextEmotion.emotion);
    
    emotionTimeoutRef.current = setTimeout(() => {
      setEmotionQueue(prev => {
        const newQueue = prev.slice(1);
        if (newQueue.length === 0) {
          console.log(`🎭 Emotion queue empty, keeping: ${nextEmotion.emotion}`);
        } else {
          setTimeout(() => processNextEmotion(), 50);
        }
        return newQueue;
      });
      emotionTimeoutRef.current = null;
    }, nextEmotion.duration);
  };

  const queueEmotion = (emotion, duration) => {
    const finalDuration = duration || getEmotionDuration(emotion);
    console.log(`🎭 Queuing emotion: ${emotion} for ${finalDuration}ms`);
    setEmotionQueue(prev => [...prev, { emotion, duration: finalDuration }]);
  };

  const setImmediateEmotion = (emotion) => {
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = null;
    }
    setEmotionQueue([]);
    
    if (emotion !== 'neutral' || currentEmotion === 'neutral') {
      setCurrentEmotion(emotion);
    }
  };

  // --- SCROLL LOGIC ---
  const handleManualScroll = (direction) => {
    const container = messagesContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      const targetScroll = direction === 'up' 
        ? container.scrollTop - scrollAmount 
        : container.scrollTop + scrollAmount;

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      if (direction === 'up') {
        setUserScrolled(true);
      }
    }
  };

  const handleScrollEvents = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolled(!isAtBottom);
    }
  };

  const scrollToBottom = (instant = false) => {
    const container = messagesContainerRef.current;
    if (container) {
      setTimeout(() => {
        try {
          if (instant || !userScrolled) {
            messagesEndRef.current?.scrollIntoView({ 
              behavior: instant ? 'auto' : 'smooth', 
              block: 'end' 
            });
            setUserScrolled(false);
          }
        } catch (error) {
          console.warn('Scroll error:', error);
        }
      }, 100);
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom();
  }, [messages, isLoading]);

  // Load available Ollama models
  useEffect(() => {
    fetchOllamaModels();
  }, []);

  // Show thinking expression during loading
  useEffect(() => {
    if (isLoading && !isSpeaking) {
      setImmediateEmotion('thoughtful');
    }
  }, [isLoading, isSpeaking]);

  const fetchOllamaModels = async () => {
    try {
      setOllamaStatus('checking');
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        const models = data.models || [];
        setAvailableModels(models);
        if (models.length > 0 && !models.find(m => m.name === selectedModel)) {
          setSelectedModel(models[0].name);
        }
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('error');
      }
    } catch (error) {
      setOllamaStatus('error');
    }
  };

  // 🔥 UPDATED: Enhanced Emotion Detection with ALL Emotions
  const analyzeEmotionFromAction = (action) => {
    const actionLower = action.toLowerCase().trim();
    
    // Direct match in emotionAliases first
    if (emotionAliases[actionLower]) {
      return emotionAliases[actionLower];
    }
    
    // Then check for partial matches
    for (const [key, emotion] of Object.entries(emotionAliases)) {
      if (actionLower.includes(key)) {
        return emotion;
      }
    }
    
    return null;
  };

  // 🔥 UPDATED: Enhanced Text Emotion Analysis
  const analyzeTextEmotion = (text, isAIResponse = false) => {
    const content = text.toLowerCase().trim();
    
    // Quick priority checks for clear emotional indicators
    if (/(\blaugh\b|\bchuckle\b|\bgiggle\b|\bhaha\b|\bhehe\b)/.test(content)) return 'joyful';
    if (/(\bsmile\b|\bgrin\b|\bgrinning\b|\bwarmly\b)/.test(content)) return 'smile';
    if (/(\bhappy\b|\bdelighted\b|\bpleased\b|\bjoy\b|\bjoyful\b)/.test(content)) return 'joyful';
    if (/(\bconcerned\b|\bworried\b|\banxious\b|\btroubled\b)/.test(content)) return 'concerned';
    if (/(\bsad\b|\bcry\b|\btears\b|\bheartbroken\b|\bunhappy\b)/.test(content)) return 'sad';
    if (/(\bangry\b|\bmad\b|\bfurious\b|\bpissed\b|\bannoyed\b)/.test(content)) return 'angry';
    if (/(\bsurprised\b|\bshocked\b|\bwow\b|\bamazing\b|\bunexpected\b)/.test(content)) return 'surprised';
    if (/(\bthink\b|\bconsider\b|\bponder\b|\bthought\b|\bthinking\b)/.test(content)) return 'thoughtful';
    if (/(\bscared\b|\bafraid\b|\bfear\b|\bterrified\b|\bfrightened\b)/.test(content)) return 'scared';
    if (/(\bexcited\b|\bthrilled\b|\boverjoyed\b|\benthusiastic\b)/.test(content)) return 'excited';
    if (/(\bexplain\b|\bdescribe\b|\bclarify\b|\belaborate\b)/.test(content)) return 'explain';
    if (/(\bcurious\b|\bintrigued\b|\bfascinated\b|\bwonder\b|\bquestion\b)/.test(content)) return 'curious';
    if (/(\bempathetic\b|\bunderstanding\b|\bcompassion\b|\bsympathetic\b)/.test(content)) return 'empathetic';
    if (/(\bfearful\b|\bterrified\b|\bpanicked\b)/.test(content)) return 'fearful';
    if (/(\brevulsed\b|\bdisgust\b|\bdisgusted\b|\bgross\b)/.test(content)) return 'revulsed';
    
    // For AI responses, detect empathetic language
    if (isAIResponse) {
      if (/(i understand|i hear you|that must be|i can imagine|that sounds)/.test(content)) return 'empathetic';
      if (/(i'm sorry|condolence|sympathy|that's terrible|how awful)/.test(content)) return 'concerned';
      if (/(are you okay|were you injured|anyone hurt|how are you feeling)/.test(content)) return 'concerned';
    }
    
    return 'neutral';
  };

  const extractEmotionsFromText = (text) => {
    const emotions = [];
    
    // Enhanced regex to capture *actions*, "quoted actions", and (parenthetical actions)
    const actionRegex = /\*([^*]+)\*|"([^"]+)"|\(([^)]+)\)/g;
    let match;
    let currentPosition = 0;
    
    actionRegex.lastIndex = 0;
    
    while ((match = actionRegex.exec(text)) !== null) {
      const fullMatch = match[0];
      const actionText = (match[1] || match[2] || match[3]).trim();
      const position = match.index;
      
      // Add text segment before this action (if any)
      const textBefore = text.substring(currentPosition, position);
      if (textBefore.trim().length > 0) {
        const textEmotion = analyzeTextEmotion(textBefore, true);
        if (textEmotion !== 'neutral') {
          emotions.push({
            emotion: textEmotion,
            position: currentPosition,
            duration: getEmotionDuration(textEmotion),
            source: 'text',
            originalText: textBefore.substring(0, 30) + '...'
          });
        }
      }
      
      // Add the action emotion
      const actionEmotion = analyzeEmotionFromAction(actionText);
      if (actionEmotion) {
        emotions.push({
          emotion: actionEmotion,
          position: position,
          duration: getEmotionDuration(actionEmotion),
          source: 'action',
          originalText: fullMatch
        });
        console.log(`🎭 Found emotion from action "${fullMatch}": ${actionEmotion}`);
      }
      
      currentPosition = position + fullMatch.length;
    }
    
    // Add remaining text after last action
    const remainingText = text.substring(currentPosition);
    if (remainingText.trim().length > 0) {
      const textEmotion = analyzeTextEmotion(remainingText, true);
      if (textEmotion !== 'neutral') {
        emotions.push({
          emotion: textEmotion,
          position: currentPosition,
          duration: getEmotionDuration(textEmotion),
          source: 'text',
          originalText: remainingText.substring(0, 30) + '...'
        });
      }
    }
    
    console.log('🎭 Final extracted emotions:', emotions);
    return emotions;
  };

  // 🔥 UPDATED: Complete Emotion Durations for ALL Emotions
  const getEmotionDuration = (emotion) => {
    const durations = {
      'smile': 4000,
      'joyful': 4000,
      'laugh': 3500,
      'surprised': 3000,
      'thoughtful': 4000,
      'concerned': 4500,
      'sad': 4500,
      'angry': 3500,
      'scared': 3500,
      'excited': 4000,
      'empathetic': 4000,
      'explain': 4000,
      'neutral': 3000,
      'curious': 4000,
      'fearful': 3500,
      'revulsed': 3500,
      'shocked': 3000,
      'thinking': 4000
    };
    return durations[emotion] || 3000;
  };

  const updateAvatarEmotion = (emotion) => {
    setImmediateEmotion(emotion);
  };

  const getModelSettings = (model) => {
    return { temperature: 0.82, top_p: 0.92, top_k: 45, repeat_penalty: 1.15 };
  };

  const stopAudio = () => {
    stopSpeech();
    freesoundService.stopAllSounds();
    setIsAudioPlaying(false);
    setIsSpeaking(false);
    setEmotionQueue([]);
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = null;
    }
  };

  const extractSegmentsWithActions = (text) => {
    const actionRegex = /\*([^*]+)\*|\(([^)]+)\)|"([^"]+)"/g;
    const segments = [];
    let lastIndex = 0;
    let match;
    
    while ((match = actionRegex.exec(text)) !== null) {
      const action = (match[1] || match[2] || match[3]).trim().toLowerCase();
      const position = match.index;
      
      const beforeText = text.substring(lastIndex, position);
      if (beforeText.trim().length > 0) {
        segments.push({ type: 'text', content: beforeText });
      }
      
      segments.push({ type: 'action', content: action });
      lastIndex = match.index + match[0].length;
    }
    
    const remainingText = text.substring(lastIndex);
    if (remainingText.trim().length > 0) {
      segments.push({ type: 'text', content: remainingText });
    }
    
    return segments;
  };

  const cleanTextForSpeech = (text) => {
    return text.replace(/\([^)]*\)/g, '').trim();
  };

  const handleTTSWithEmotions = async (segments, emotions) => {
    if (!ttsEnabled || segments.length === 0) return;
    
    try {
      setIsSpeaking(true);
      setIsAudioPlaying(true);
      setImmediateEmotion('neutral');
      
      let emotionIndex = 0;
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        if (segment.type === 'text') {
          let cleanText = cleanTextForSpeech(segment.content);
          cleanText = cleanText.replace(/\s+/g, ' ').trim().replace(/^[.,!?;]\s*/, '');
          
          if (cleanText.length > 0) {
            // Queue extracted emotions for this segment
            while (emotionIndex < emotions.length) {
              const nextEmotion = emotions[emotionIndex];
              if (i > 0) await new Promise(r => setTimeout(r, 200));
              queueEmotion(nextEmotion.emotion, nextEmotion.duration);
              emotionIndex++;
            }
            await generateSpeech(cleanText, selectedVoice);
          }
        } else if (segment.type === 'action') {
          const actionEmotion = analyzeEmotionFromAction(segment.content);
          if (actionEmotion) {
            queueEmotion(actionEmotion, getEmotionDuration(actionEmotion));
          }
          
          if (isSpeechPlaying()) pauseSpeech();
          await freesoundService.playSoundForAction(segment.content);
          if (isSpeechPlaying()) resumeSpeech();
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      if (emotions.length > 0) {
        setImmediateEmotion(emotions[emotions.length - 1].emotion);
      }
      
    } catch (error) {
      console.warn('❌ TTS failed:', error.message);
    } finally {
      setIsSpeaking(false);
      setIsAudioPlaying(false);
    }
  };

  // 🔥 UPDATED: Enhanced Prompt with ALL Emotion Support
  const fetchOllamaResponse = async (messages, userMessage) => {
    try {
      const modelSettings = getModelSettings(selectedModel);
      
      const conversationHistory = messages.slice(-8).map(msg => 
        `${msg.role === 'user' ? 'User' : currentPersona}: ${msg.content}`
      ).join('\n');

      const prompt = `You are ${currentPersona}, a warm and expressive medical professional. 

EMOTION EXPRESSION GUIDE - USE THESE FREQUENTLY:
*smile* - For warmth, greetings, positivity, reassurance
*laugh* - For humor, light moments, joy
*thoughtful* - When considering, thinking, analyzing
*concerned* - For serious topics, worries, problems
*sad* - For empathy with sadness, loss, disappointment  
*curious* - When interested, asking questions, learning
*surprised* - For unexpected news, revelations
*excited* - For good news, enthusiasm, positive energy
*explain* - When teaching, clarifying information
*empathetic* - For deep understanding and compassion
*scared* - For fear, danger concerns
*angry* - For frustration, injustice (use sparingly)

CONVERSATION RULES:
1. Be natural and expressive - use emotions to enhance communication
2. Match emotion to context: happy topics = *smile*, serious = *concerned*
3. Use *thoughtful* when considering options or giving advice
4. Use *curious* when asking about someone's experiences
5. Place emotions naturally within sentences, not just at start/end

EXAMPLES:
- *smile* "I'm glad to hear you're doing well today!"
- *thoughtful* "Let me think about the best way to help with that..."
- *curious* "What made you interested in learning about this?"
- *concerned* "I'm sorry to hear you've been struggling with that."

Conversation context:
${conversationHistory || "New conversation"}

User: ${userMessage}
${currentPersona}:`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          stream: false,
          options: modelSettings
        }),
      });

      if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama Request failed:', error);
      throw error;
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return;

    if (isSpeechPlaying()) stopAudio();

    const userEmotion = analyzeTextEmotion(content, false);
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      emotion: userEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    updateAvatarEmotion(userEmotion);
    setTimeout(() => scrollToBottom(true), 50);

    try {
      updateAvatarEmotion('thoughtful');

      const aiResponse = await fetchOllamaResponse([...messages, userMessage], content.trim());
      const emotions = extractEmotionsFromText(aiResponse);
      
      let baseEmotion = 'neutral';
      if (emotions.length > 0) baseEmotion = emotions[0].emotion;

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        emotion: baseEmotion,
        persona: currentPersona
      };

      setMessages(prev => [...prev, aiMessage]);
      setUserScrolled(false);
      setTimeout(() => scrollToBottom(), 100);

      setIsLoading(false); 

      if (ttsEnabled) {
          const segments = extractSegmentsWithActions(aiResponse);
          await handleTTSWithEmotions(segments, emotions);
      }

    } catch (error) {
      console.error('❌ AI Response failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
        emotion: 'concerned',
        persona: currentPersona
      };
      setMessages(prev => [...prev, errorMessage]);
      updateAvatarEmotion('concerned');
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (isSpeechPlaying()) stopAudio();
    setMessages([]);
    setCurrentEmotion('neutral');
    setUserScrolled(false);
    lastAssistantMessageRef.current = null;
    setEmotionQueue([]);
  };

  const getOllamaStatusText = () => {
    switch (ollamaStatus) {
      case 'connected': return 'Connected';
      case 'error': return 'Not Connected';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  // 🔥 UPDATED: Complete Emotion Display Names
  const getEmotionDisplayName = (emotion) => {
    const names = {
      'neutral': 'Calm',
      'joyful': 'Joyful', 
      'sad': 'Compassionate',
      'angry': 'Angry',
      'surprised': 'Surprised',
      'thoughtful': 'Thinking',
      'scared': 'Caring',
      'excited': 'Excited',
      'concerned': 'Concerned',
      'explain': 'Explaining',
      'smile': 'Smiling',
      'curious': 'Curious',
      'empathetic': 'Empathetic',
      'fearful': 'Concerned',
      'revulsed': 'Concerned',
      'shocked': 'Surprised',
      'thinking': 'Thinking',
      'laugh': 'Laughing'
    };
    return names[emotion] || 'Calm';
  };

  return (
    <div className="chat-page">
      <VideoBackground />
      
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <div className="app-title">
              <span className="title-icon">🌿</span>
              <h1>Serenity</h1>
            </div>
          </div>
          
          <div className="header-center">
            <div className="persona-info">
              <h2>{currentPersona}</h2>
              <div className="status-pill">
                <span className="status-dot"></span>
                <span className="status-text">{getEmotionDisplayName(currentEmotion)}</span>
                {emotionQueue.length > 0 && (
                  <span className="emotion-queue-indicator">+{emotionQueue.length}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="connection-status">
              <div className={`status-indicator ${ollamaStatus}`}>
                {ollamaStatus === 'connected' ? '🟢' : ollamaStatus === 'error' ? '🔴' : '🟡'}
              </div>
              <span>Ollama: {getOllamaStatusText()}</span>
            </div>
          </div>
        </div>

        <div className="chat-content">
          {/* Avatar Section */}
          <div className="avatar-section">
            <AvatarDisplay 
              persona={currentPersona}
              emotion={currentEmotion}
              isSpeaking={isSpeaking}
              forceVideo={!showImage}
              isLoading={isLoading}
            />
            
            <div className="avatar-info-panel">
              <div className="info-row">
                <span className="info-label">Persona:</span>
                <span className="info-value">{currentPersona}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Emotion:</span>
                <span className="info-value emotion-value">{getEmotionDisplayName(currentEmotion)}</span>
                {emotionQueue.length > 0 && (
                  <span className="queue-indicator">(+{emotionQueue.length})</span>
                )}
              </div>
              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{voiceGenderMap[selectedVoice] === 'male' ? 'Male' : 'Female'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value status-value">
                  {isLoading ? 'Thinking...' : isSpeaking ? 'Speaking' : 'Listening'}
                </span>
              </div>
            </div>

            <div className="audio-controls-panel">
              <div className="control-group">
                <button 
                  className={`control-btn stop-btn ${!isAudioPlaying ? 'disabled' : ''}`}
                  onClick={stopAudio}
                  disabled={!isAudioPlaying}
                >
                  <span className="btn-icon">⏹️</span>
                  <span>Stop Audio</span>
                </button>
              </div>
              
              <div className="voice-selection">
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="voice-select"
                >
                  <option value="sarah">Sarah (UK) - Female</option>
                  <option value="megan">Megan (US) - Female</option>
                  <option value="theo">Theo (UK) - Male</option>
                  <option value="jack">Jack (US) - Male</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conversation Section */}
          <div className="conversation-section">
            <div className="control-bar">
              <div className="control-group left">
                <button 
                  className={`control-btn toggle-btn ${showImage ? 'active' : ''}`}
                  onClick={() => setShowImage(!showImage)}
                >
                  <span className="btn-icon">{showImage ? '🖼️' : '🎭'}</span>
                  <span>{showImage ? 'Image' : 'Video'}</span>
                </button>
                
                <button 
                  className={`control-btn tts-btn ${ttsEnabled ? 'active' : ''}`}
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                >
                  <span className="btn-icon">🔊</span>
                  <span>TTS: {ttsEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="control-group center">
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="model-select"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(model => (
                      <option key={model.name} value={model.name}>
                        {model.name}
                      </option>
                    ))
                  ) : (
                    <option value="llama3.1:8b">Llama 3.1 8B</option>
                  )}
                </select>
              </div>

              <div className="control-group right scroll-controls">
                <button 
                  className="scroll-btn" 
                  onClick={() => handleManualScroll('up')}
                  title="Scroll Up"
                >
                  ⬆️
                </button>
                <button 
                  className="scroll-btn" 
                  onClick={() => handleManualScroll('down')}
                  title="Scroll Down"
                >
                  ⬇️
                </button>
                
                <button className="control-btn clear-btn" onClick={clearChat}>
                  <span className="btn-icon">🧹</span>
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="messages-container-wrapper">
              <div 
                className="messages-container" 
                ref={messagesContainerRef}
                onScroll={handleScrollEvents}
              >
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <div className="welcome-content">
                      <div className="welcome-icon">🌙</div>
                      <h2>Welcome to Serenity</h2>
                      <p>Your peaceful space for conversation with {currentPersona}</p>
                      <div className="welcome-tip">
                        <strong>Tip:</strong> Try asking me to show different emotions like 
                        *smile*, *laugh*, *curious*, or *thoughtful*!
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      emotion={message.emotion}
                      persona={message.persona || currentPersona} 
                    />
                  ))
                )}
                
                {isLoading && (
                  <div className="message loading-message">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                      <small>{currentPersona} is thinking...</small>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-container">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;