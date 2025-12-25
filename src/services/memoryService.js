// src/services/memoryService.js
// Hybrid Memory System: Immediate Context Buffer + Long-Term Emotional Vault
class MemoryService {
    constructor() {
        // Immediate Context Buffer (short-term memory)
        this.immediateBuffer = [];
        this.bufferSize = 10; // Last 10 messages

        // Long-Term Emotional Vault
        this.memories = [];
        this.initialized = false;

        // Session storage for persistent memory across refreshes
        this.sessionKey = 'serenity_memory_vault';
        this.bufferKey = 'serenity_buffer';

        console.log('🧠 Memory Service Initialized');
    }

    async initialize() {
        try {
            // Load from localStorage for persistence
            const savedMemories = localStorage.getItem(this.sessionKey);
            const savedBuffer = localStorage.getItem(this.bufferKey);

            if (savedMemories) {
                this.memories = JSON.parse(savedMemories);
                console.log(`📚 Loaded ${this.memories.length} memories from storage`);
            }

            if (savedBuffer) {
                this.immediateBuffer = JSON.parse(savedBuffer);
                console.log(`📝 Loaded ${this.immediateBuffer.length} buffer entries`);
            }

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('❌ Memory initialization failed:', error);
            return false;
        }
    }

    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.sessionKey, JSON.stringify(this.memories));
            localStorage.setItem(this.bufferKey, JSON.stringify(this.immediateBuffer));
        } catch (error) {
            console.warn('⚠️ Could not save to localStorage:', error);
        }
    }

    // Add to immediate buffer
    addToBuffer(entry) {
        this.immediateBuffer.push({
            ...entry,
            timestamp: new Date().toISOString()
        });

        // Keep buffer at fixed size
        if (this.immediateBuffer.length > this.bufferSize) {
            this.immediateBuffer = this.immediateBuffer.slice(-this.bufferSize);
        }

        this.saveToStorage();
    }

    // Add significant emotional event to long-term memory
    addMemory(content, metadata = {}) {
        const memory = {
            id: Date.now().toString(),
            content,
            emotion: metadata.emotion || 'neutral',
            type: metadata.type || 'conversation',
            significance: metadata.significance || 1,
            timestamp: new Date().toISOString(),
            tags: metadata.tags || [],
            ...metadata
        };

        this.memories.push(memory);

        // Keep memory vault manageable
        if (this.memories.length > 100) {
            // Remove least significant memories
            this.memories.sort((a, b) => b.significance - a.significance);
            this.memories = this.memories.slice(0, 80);
        }

        console.log('💾 Added to long-term memory:', {
            emotion: memory.emotion,
            significance: memory.significance,
            content: content.substring(0, 50) + '...'
        });

        this.saveToStorage();
        return memory;
    }

    // Add conversation with automatic significance scoring
    async addConversation(conversation) {
        const { role, content, emotion, persona } = conversation;

        // Calculate significance score
        let significance = 1;
        const lowerContent = content.toLowerCase();

        // High significance for emotional content
        if (emotion !== 'neutral') significance += 1;
        if (['sad', 'angry', 'scared', 'shocked'].includes(emotion)) significance += 2;
        if (emotion === 'empathetic') significance += 1;

        // High significance for trauma-related content
        if (lowerContent.includes('ptsd') ||
            lowerContent.includes('trauma') ||
            lowerContent.includes('abuse')) significance += 3;

        if (lowerContent.includes('family') &&
            (lowerContent.includes('betray') || lowerContent.includes('uncle'))) significance += 2;

        if (lowerContent.includes('police') || lowerContent.includes('charge')) significance += 2;

        // Moderate significance for personal details
        if (lowerContent.includes('i feel') ||
            lowerContent.includes('my ') ||
            lowerContent.includes('i am')) significance += 1;

        // Extract key topics as tags
        const tags = [];
        if (lowerContent.includes('uncle')) tags.push('family', 'uncle');
        if (lowerContent.includes('family')) tags.push('family');
        if (lowerContent.includes('abuse')) tags.push('abuse', 'trauma');
        if (lowerContent.includes('ptsd')) tags.push('ptsd', 'trauma');
        if (lowerContent.includes('police')) tags.push('legal', 'police');
        if (lowerContent.includes('charge')) tags.push('legal', 'charges');
        if (lowerContent.includes('betray')) tags.push('betrayal', 'trust');
        if (lowerContent.includes('thief') || lowerContent.includes('steal')) tags.push('theft', 'property');

        // Add to buffer
        this.addToBuffer({
            role,
            content,
            emotion,
            persona
        });

        // Only add to long-term memory if significant
        if (significance >= 2) {
            return this.addMemory(content, {
                emotion,
                type: 'conversation',
                significance,
                tags,
                role,
                persona
            });
        }

        return null;
    }

    // Search for relevant memories
    searchMemories(query, options = {}) {
        if (!this.memories.length) return [];

        const {
            limit = 5,
            minSignificance = 1,
            emotionFilter = null,
            tagFilter = []
        } = options;

        const lowerQuery = query.toLowerCase();

        // Simple relevance scoring
        const scoredMemories = this.memories.map(memory => {
            let score = 0;
            const lowerContent = memory.content.toLowerCase();

            // Exact match
            if (lowerContent.includes(lowerQuery)) score += 5;

            // Word overlap
            const queryWords = lowerQuery.split(/\s+/);
            queryWords.forEach(word => {
                if (word.length > 3 && lowerContent.includes(word)) score += 2;
            });

            // Tag matching
            if (memory.tags) {
                queryWords.forEach(word => {
                    if (memory.tags.includes(word)) score += 3;
                });
            }

            // Emotion matching
            if (memory.emotion && emotionFilter === memory.emotion) score += 2;

            // Recent memories get bonus
            const ageInDays = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            if (ageInDays < 7) score += 1; // Memories less than a week old
            if (ageInDays < 1) score += 2; // Memories from today

            // Significance bonus
            score += memory.significance;

            return { ...memory, relevanceScore: score };
        });

        // Filter and sort
        return scoredMemories
            .filter(m => m.significance >= minSignificance)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, limit);
    }

    // Get context for AI prompt
    getCurrentContext() {
        if (!this.memories.length && !this.immediateBuffer.length) {
            return "No previous context available.";
        }

        const contextParts = [];

        // Add relevant memories based on recent buffer
        if (this.immediateBuffer.length > 0) {
            const lastMessage = this.immediateBuffer[this.immediateBuffer.length - 1];
            if (lastMessage && lastMessage.content) {
                const relevantMemories = this.searchMemories(lastMessage.content, {
                    limit: 3,
                    minSignificance: 2
                });

                if (relevantMemories.length > 0) {
                    contextParts.push("PREVIOUS IMPORTANT CONVERSATIONS:");
                    relevantMemories.forEach((memory, index) => {
                        const emotionDisplay = memory.emotion !== 'neutral' ? ` (${memory.emotion})` : '';
                        contextParts.push(`${index + 1}. ${memory.persona || 'User'}: "${memory.content.substring(0, 100)}..."${emotionDisplay}`);
                    });
                }
            }
        }

        // Add recent buffer context
        if (this.immediateBuffer.length > 0) {
            contextParts.push("\nRECENT CONVERSATION:");
            const recent = this.immediateBuffer.slice(-5);
            recent.forEach(entry => {
                const role = entry.role === 'user' ? 'User' : (entry.persona || 'Assistant');
                const emotion = entry.emotion && entry.emotion !== 'neutral' ? ` *${entry.emotion}*` : '';
                contextParts.push(`${role}: ${entry.content.substring(0, 80)}...${emotion}`);
            });
        }

        // Add emotional patterns if detected
        const emotionalPatterns = this.detectEmotionalPatterns();
        if (emotionalPatterns) {
            contextParts.push(`\nEMOTIONAL CONTEXT: ${emotionalPatterns}`);
        }

        return contextParts.join('\n');
    }

    // Detect emotional patterns in memories
    detectEmotionalPatterns() {
        if (!this.memories.length) return null;

        const recentMemories = this.memories.slice(-20);
        const emotions = recentMemories.map(m => m.emotion).filter(e => e && e !== 'neutral');

        if (emotions.length === 0) return null;

        // Count emotion frequencies
        const emotionCounts = {};
        emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });

        // Get top emotions
        const sortedEmotions = Object.entries(emotionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (sortedEmotions.length === 0) return null;

        const patterns = [];

        if (sortedEmotions.some(([e]) => ['sad', 'concerned', 'empathetic'].includes(e))) {
            patterns.push("User has been discussing emotional/personal topics");
        }

        if (sortedEmotions.some(([e]) => ['angry', 'shocked'].includes(e))) {
            patterns.push("User has expressed strong reactions to difficult situations");
        }

        if (sortedEmotions.some(([e]) => ['thoughtful', 'explain'].includes(e))) {
            patterns.push("Conversation has involved analytical or explanatory content");
        }

        return patterns.join('. ');
    }

    // Clear session (for new conversation)
    clearSession() {
        this.immediateBuffer = [];
        // Don't clear long-term memories, just the buffer
        this.saveToStorage();
        console.log('🧹 Memory buffer cleared');
    }

    // Export memories (for backup)
    exportMemories() {
        return {
            memories: this.memories,
            buffer: this.immediateBuffer,
            exportedAt: new Date().toISOString()
        };
    }

    // Import memories
    importMemories(data) {
        if (data.memories && Array.isArray(data.memories)) {
            this.memories = [...this.memories, ...data.memories];
        }
        if (data.buffer && Array.isArray(data.buffer)) {
            this.immediateBuffer = data.buffer;
        }
        this.saveToStorage();
        console.log(`📥 Imported ${data.memories?.length || 0} memories`);
    }

    // Get statistics
    getStats() {
        return {
            totalMemories: this.memories.length,
            bufferSize: this.immediateBuffer.length,
            topEmotions: this.getTopEmotions(),
            lastUpdated: this.memories.length > 0
                ? new Date(this.memories[this.memories.length - 1].timestamp).toLocaleString()
                : 'Never'
        };
    }

    getTopEmotions() {
        const emotions = this.memories
            .map(m => m.emotion)
            .filter(e => e && e !== 'neutral');

        const counts = {};
        emotions.forEach(emotion => {
            counts[emotion] = (counts[emotion] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([emotion, count]) => ({ emotion, count }));
    }
}

// Export singleton instance
export const memoryService = new MemoryService();