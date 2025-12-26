// src/pages/ChatPage.jsx - UPDATED WITH MEMORY INTEGRATION
import React, { useState, useRef, useEffect } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import AvatarDisplay from '../components/AvatarDisplay';
import { generateSpeech, stopSpeech, isSpeechPlaying, pauseSpeech, resumeSpeech } from '../services/speechmaticsTtsService';
import { freesoundService } from '../services/freesoundService';
import { memoryService } from '../services/memoryService'; // ADDED
import { getAvatarConfig, getPersonaByVoice, voiceGenderMap, emotionAliases, extractEmotionFromText } from '../config/avatarConfig';
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
    const [memorySummary, setMemorySummary] = useState(null); // ADDED

    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const isProcessingQueue = useRef(false); // Ref to track active playback loop

    // State for scroll detection
    const [userScrolled, setUserScrolled] = useState(false);

    // Get persona based on selected voice
    const [currentPersona, setCurrentPersona] = useState('Dr. Elara');

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

    // Initialize memory service and load memory summary
    useEffect(() => {
        memoryService.initialize().then(() => {
            setMemorySummary(memoryService.getMemorySummary());
        });
    }, []);

    // Duration settings
    const getEmotionDuration = (emotion) => {
        const durations = {
            'smile': 10000,
            'joyful': 10000,
            'laugh': 8000,
            'surprised': 7000,
            'thoughtful': 10000,
            'concerned': 12000,
            'sad': 12000,
            'angry': 8000,
            'scared': 8000,
            'excited': 10000,
            'empathetic': 10000,
            'explain': 10000,
            'neutral': 8000,
            'curious': 10000,
            'fearful': 8000,
            'revulsed': 8000,
            'shocked': 7000,
            'thinking': 10000,
            'giggle': 6000,
            'happy': 10000,
            'frown': 10000
        };
        return durations[emotion] || 8000;
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
            setCurrentEmotion('thoughtful');
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

    // FIXED: Use the centralized extractEmotionFromText function
    const analyzeEmotionFromAction = (action) => {
        // Use the centralized emotion extraction
        const emotion = extractEmotionFromText(`*${action}*`);
        return emotion || 'neutral';
    };

    const analyzeTextEmotion = (text, isAIResponse = false) => {
        // Use the centralized emotion extraction
        let emotion = extractEmotionFromText(text);

        // Fallback for AI-specific patterns
        if (isAIResponse && emotion === 'neutral') {
            const content = text.toLowerCase().trim();
            if (/(i understand|i hear you|that must be|i know how you feel)/.test(content)) return 'empathetic';
            if (/(i'm sorry|condolence|sympathy|apologize)/.test(content)) return 'concerned';
            if (/(thank you|thanks|appreciate|grateful)/.test(content)) return 'smile';
        }

        return emotion;
    };

    const extractEmotionsFromText = (text) => {
        const emotions = [];
        const actionRegex = /\*([^*]+)\*|"([^"]+)"|\(([^)]+)\)/g;
        let match;

        while ((match = actionRegex.exec(text)) !== null) {
            const actionText = (match[1] || match[2] || match[3]).trim();
            const actionEmotion = analyzeEmotionFromAction(actionText);
            if (actionEmotion) {
                emotions.push({
                    emotion: actionEmotion,
                    isDemonstration: false
                });
            }
        }
        return emotions;
    };

    const getModelSettings = (model) => {
        return { temperature: 0.82, top_p: 0.92, top_k: 45, repeat_penalty: 1.15 };
    };

    const stopAudio = () => {
        stopSpeech();
        freesoundService.stopAllSounds();
        setIsAudioPlaying(false);
        setIsSpeaking(false);
        isProcessingQueue.current = false;
    };

    // Helper: Wait function
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: Wait for Audio to Finish
    const waitForAudioCompletion = () => {
        return new Promise(resolve => {
            // Immediate check
            if (!isSpeechPlaying()) {
                resolve();
                return;
            }

            // Poll every 100ms
            const checkInterval = setInterval(() => {
                if (!isSpeechPlaying()) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Safety timeout (max 20 seconds waiting for one sentence)
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 20000);
        });
    };

    const cleanTextForSpeech = (text) => {
        // Remove actions *...* and (...)
        return text.replace(/\*.*?\*/g, '').replace(/\(.*?\)/g, '').trim();
    };

    const extractSegmentsWithActions = (text) => {
        // Split text by *action* or (action) or "Speech"
        const regex = /(\*.*?\*|\(.*?\)|"[^"]+")/g;
        const parts = text.split(regex);
        const segments = [];

        parts.forEach(part => {
            const clean = part.trim();
            if (!clean) return;

            // Check if Action
            if ((clean.startsWith('*') && clean.endsWith('*')) || (clean.startsWith('(') && clean.endsWith(')'))) {
                segments.push({ type: 'action', content: clean.slice(1, -1).trim() });
            }
            // Else it's text (remove quotes if present)
            else {
                const textContent = (clean.startsWith('"') && clean.endsWith('"')) ? clean.slice(1, -1) : clean;
                if (textContent.trim()) {
                    segments.push({ type: 'text', content: textContent.trim() });
                }
            }
        });
        return segments;
    };

    // MAIN TTS HANDLER - STRICT SEQUENTIAL LOGIC
    const handleTTSWithEmotions = async (segments) => {
        if (!ttsEnabled || segments.length === 0) return;

        // Reset state
        if (isProcessingQueue.current) stopAudio();

        try {
            isProcessingQueue.current = true;
            setIsSpeaking(true);
            setIsAudioPlaying(true);
            setCurrentEmotion('neutral');

            await handleSequentialPlayback(segments);

        } catch (error) {
            console.warn('❌ TTS Error:', error);
        } finally {
            setIsSpeaking(false);
            setIsAudioPlaying(false);
            isProcessingQueue.current = false;
        }
    };

    // UNIFIED SEQUENTIAL PLAYBACK
    const handleSequentialPlayback = async (segments) => {
        for (const segment of segments) {
            if (!isProcessingQueue.current) break;

            if (segment.type === 'action') {
                const emotion = analyzeEmotionFromAction(segment.content);
                if (emotion) {
                    console.log(`🎭 Action detected: ${emotion}`);
                    setCurrentEmotion(emotion);

                    // Try to play sound
                    try {
                        await freesoundService.playSoundForAction(emotion);
                    } catch (e) {
                        console.warn('Sound skipped:', e.message);
                    }

                    // Pause to let the emotion "land" visually (1.5 seconds)
                    await wait(1500);
                }
            }
            else if (segment.type === 'text') {
                const textToSpeak = cleanTextForSpeech(segment.content);
                if (textToSpeak.length > 0) {

                    // CHECK: Does the text ITSELF imply an emotion?
                    const impliedEmotion = analyzeTextEmotion(textToSpeak, true);
                    if (impliedEmotion !== 'neutral') {
                        console.log(`🎭 Text implied emotion: ${impliedEmotion}`);
                        setCurrentEmotion(impliedEmotion);
                    }

                    console.log(`🗣️ Speaking: "${textToSpeak.substring(0, 30)}..."`);

                    // Start speaking
                    await generateSpeech(textToSpeak, selectedVoice);

                    // Wait for speech to fully finish before moving to next segment
                    await waitForAudioCompletion();

                    // Small pause between sentences
                    await wait(300);
                }
            }
        }
    };

    const fetchOllamaResponse = async (messages, userMessage) => {
        try {
            const modelSettings = getModelSettings(selectedModel);

            // Get memory context
            const memoryContext = memoryService.getCurrentContext();

            // Build enhanced prompt with memory
            const prompt = `You are ${currentPersona}, a compassionate healthcare professional. 
FORMATTING INSTRUCTIONS:
- Use *emotion* to show expressions.
- Place text inside "quotes" if specifically demonstrating.
- Example: *smile* I am happy. *sad* I am sad.
- Remember the conversation history and maintain continuity.

${memoryContext ? `CONVERSATION CONTEXT:\n${memoryContext}\n\n` : ''}

Current user message: ${userMessage}

${currentPersona}:`;

            console.log('📝 Prompt with memory context:', prompt.substring(0, 200) + '...');

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

        if (isSpeaking) stopAudio();

        const userEmotion = analyzeTextEmotion(content, false);
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString(),
            emotion: userEmotion
        };

        // Add user message to memory FIRST
        await memoryService.addConversation({
            role: 'user',
            content: content.trim(),
            emotion: userEmotion,
            persona: 'User'
        });

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setCurrentEmotion(userEmotion);

        setTimeout(() => scrollToBottom(true), 50);

        try {
            // Show thinking face
            setCurrentEmotion('thoughtful');

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

            // Add AI response to memory
            await memoryService.addConversation({
                role: 'assistant',
                content: aiResponse,
                emotion: baseEmotion,
                persona: currentPersona
            });

            setMessages(prev => [...prev, aiMessage]);
            setUserScrolled(false);
            setTimeout(() => scrollToBottom(), 100);

            // Update memory summary
            setMemorySummary(memoryService.getMemorySummary());

            setIsLoading(false);

            if (ttsEnabled) {
                const segments = extractSegmentsWithActions(aiResponse);
                await handleTTSWithEmotions(segments);
            } else {
                // Fallback if TTS disabled
                if (emotions.length > 0) {
                    setCurrentEmotion(emotions[emotions.length - 1].emotion);
                }
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
            setCurrentEmotion('concerned');
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        stopAudio();
        setMessages([]);
        memoryService.clearSession();
        setCurrentEmotion('neutral');
        setUserScrolled(false);
        setMemorySummary(memoryService.getMemorySummary());
    };

    const getOllamaStatusText = () => {
        switch (ollamaStatus) {
            case 'connected': return 'Connected';
            case 'error': return 'Not Connected';
            case 'checking': return 'Checking...';
            default: return 'Unknown';
        }
    };

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
            'laugh': 'Laughing',
            'giggle': 'Giggling',
            'happy': 'Happy',
            'frown': 'Concerned'
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

                            {/* Memory Summary Display */}
                            {memorySummary && (
                                <div className="memory-summary">
                                    <div className="info-row">
                                        <span className="info-label">Memory:</span>
                                        <span className="info-value">
                      {memorySummary.totalMemories > 0 ?
                          `${memorySummary.totalMemories} memories, ${memorySummary.recentConversations} recent` :
                          'No memories yet'}
                    </span>
                                    </div>
                                    {memorySummary.currentTopics && memorySummary.currentTopics.length > 0 && (
                                        <div className="info-row">
                                            <span className="info-label">Topics:</span>
                                            <span className="info-value">
                        {memorySummary.currentTopics.slice(0, 2).join(', ')}
                                                {memorySummary.currentTopics.length > 2 && '...'}
                      </span>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                            {memorySummary && memorySummary.totalMemories > 0 && (
                                                <div className="memory-welcome-note">
                                                    <small>📚 I remember our previous conversations ({memorySummary.totalMemories} memories)</small>
                                                </div>
                                            )}
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