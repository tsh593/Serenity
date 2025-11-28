import { GEMINI_API_KEY, CHAT_BRAIN_API_URL } from '../config/apiConfig';

export const generateResponse = async (userMessage, chatHistory = []) => {
  console.log('Gemini API Key loaded:', !!GEMINI_API_KEY);
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured.');
  }

  try {
    // Build conversation context
    const conversationContext = chatHistory
      .slice(-4)
      .map(msg => `${msg.type === 'user' ? 'User' : (msg.persona || 'AI')}: ${msg.text}`)
      .join('\n');

    const requestBody = {
      contents: [
        {
          parts: [
            {

              text: `You are Dr. Elara, a friendly doctor. Respond to the user in a spontaneous, casual, and natural way, as if you are chatting with a friend. Use everyday speech, short sentences, and casual phrasing. Avoid sounding scripted, overly empathetic, or like a therapist. Only offer support if the user asks for it. Use humor, curiosity, and personality. Vary your tone and style based on the user's mood and context. Use contractions, rhetorical questions, exclamations, and show excitement or playfulness when appropriate. Express an appropriate emotion in your reply. At the end of your reply, ALWAYS include [EMOTION: emotion] where emotion is one of: joyful, concerned, thoughtful, surprised, neutral, amused, playful, touched, explain, sad, angry, revulsed, smile, excited. If the user requests a specific emotion or face (e.g., "show me your smile"), use that emotion. Keep your response to 1-2 sentences.

Conversation history:
${conversationContext}

User: ${userMessage}

Reply as Dr. Elara.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200
      }
    };

    console.log('Sending request to Gemini API...');
    
    const response = await fetch(CHAT_BRAIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full API response:', data);
    
    let responseText = '';
    if (data.candidates && Array.isArray(data.candidates) && data.candidates[0]) {
      const candidate = data.candidates[0];
      if (candidate.content) {
        console.log('Gemini candidate.content:', candidate.content);
        // Try parts[0].text
        if (candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts[0] && typeof candidate.content.parts[0].text === 'string') {
          responseText = candidate.content.parts[0].text;
        } else if (typeof candidate.content.text === 'string') {
          responseText = candidate.content.text;
        } else if (typeof candidate.content === 'string') {
          responseText = candidate.content;
        } else {
          responseText = JSON.stringify(candidate.content);
        }
      } else if (candidate.output) {
        responseText = candidate.output;
      } else if (candidate.text) {
        responseText = candidate.text;
      } else if (typeof candidate === 'string') {
        responseText = candidate;
      } else {
        responseText = JSON.stringify(candidate);
      }
    }

    if (!responseText || responseText === '{}' || responseText.includes('"role"')) {
      responseText = "I'm here to chat with you! How can I help?";
      console.error('Invalid Gemini response structure or empty response:', data);
    }

    console.log('Raw response text:', responseText);
    
    // Parse persona and emotion from response
    let persona = 'Dr. Elara';
    let emotion = 'neutral';
    let cleanText = responseText;

    // Extract [EMOTION: ...] from response
      const emotionMatch = responseText.match(/\[EMOTION:\s*(joyful|concerned|thoughtful|surprised|neutral|amused|playful|touched|explain|sad|angry|revulsed|smile|excited)\]/i);
    if (emotionMatch) {
      let rawEmotion = emotionMatch[1].toLowerCase();
      // Map amused/playful/touched to surprised for avatar
      if (rawEmotion === 'amused' || rawEmotion === 'playful' || rawEmotion === 'touched') {
        emotion = 'surprised';
      } else {
        emotion = rawEmotion;
      }
      cleanText = responseText.replace(emotionMatch[0], '').trim();
    }

    if (!cleanText || cleanText.length < 2) {
      cleanText = "I'm here to chat with you! How can I help?";
    }

    console.log('Final parsed:', { persona, emotion, text: cleanText });

    return {
      text: cleanText,
      persona,
      emotion
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      text: "I apologize, but I'm having trouble responding right now. Could you try again?",
      persona: "Dr. Elara",
      emotion: "concerned"
    };
  }
};