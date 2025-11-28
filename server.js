// server.js - CORRECT SPEECHMATICS TTS VERSION
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

console.log('🔍 Environment check:');
console.log('   SPEECHMATICS_API_KEY exists:', !!process.env.SPEECHMATICS_API_KEY);
console.log('   REACT_APP_SPEECHMATICS_API_KEY exists:', !!process.env.REACT_APP_SPEECHMATICS_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Get Speechmatics API key
const SPEECHMATICS_API_KEY = process.env.SPEECHMATICS_API_KEY || process.env.REACT_APP_SPEECHMATICS_API_KEY;

// Speechmatics TTS voice options (from the documentation)
const SPEECHMATICS_VOICES = {
  SARAH: 'sarah',  // English Female (UK)
  THEO: 'theo',    // English Male (UK) 
  MEGAN: 'megan',  // English Female (US)
  JACK: 'jack'     // English Male (US)
};

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Speechmatics TTS API Server is running!',
    timestamp: new Date().toISOString(),
    api_key_configured: !!SPEECHMATICS_API_KEY,
    service: 'Speechmatics TTS (Preview)'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    api_key_configured: !!SPEECHMATICS_API_KEY,
    voices_available: Object.keys(SPEECHMATICS_VOICES).length
  });
});

// Main TTS endpoint
app.post('/api/tts', async (req, res) => {
  const { text, voice = SPEECHMATICS_VOICES.SARAH } = req.body;

  console.log('🎯 TTS Request (Speechmatics):', { 
    text_length: text?.length, 
    voice
  });

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing text parameter' 
    });
  }

  if (!SPEECHMATICS_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      error: 'Speechmatics API key not configured' 
    });
  }

  try {
    console.log('📡 Calling Speechmatics TTS API...');
    
    // CORRECT Speechmatics TTS endpoint from documentation
    const response = await fetch(`https://preview.tts.speechmatics.com/generate/${voice}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SPEECHMATICS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.substring(0, 1000), // Limit text length
      }),
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers));

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      console.log('✅ WAV audio received, size:', audioBuffer.byteLength, 'bytes');

      // Set appropriate headers for WAV audio
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', audioBuffer.byteLength);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send the audio buffer directly
      res.send(Buffer.from(audioBuffer));
    } else {
      const errorText = await response.text();
      console.error('❌ Speechmatics API error:', response.status, errorText);
      throw new Error(`Speechmatics API error: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('❌ TTS Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// Test endpoint - verify API connectivity
app.post('/api/tts/test', async (req, res) => {
  try {
    console.log('🧪 Testing Speechmatics TTS API connectivity...');
    
    if (!SPEECHMATICS_API_KEY) {
      return res.json({
        success: false,
        error: 'API key not configured',
        message: 'Add SPEECHMATICS_API_KEY to your .env file'
      });
    }

    // Test with a simple request
    const response = await fetch(`https://preview.tts.speechmatics.com/generate/sarah`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SPEECHMATICS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "Hello, this is a connectivity test.",
      }),
    });

    const result = {
      success: response.ok,
      api_key_configured: true,
      api_status: response.status,
      api_status_text: response.statusText,
      service: 'Speechmatics TTS (Preview)',
      endpoint: 'https://preview.tts.speechmatics.com/generate/',
      available_voices: Object.keys(SPEECHMATICS_VOICES)
    };

    if (!response.ok) {
      const errorText = await response.text();
      result.error = `API test failed: ${response.status} ${response.statusText}`;
      result.details = errorText;
    } else {
      result.message = '✅ Speechmatics TTS API is working!';
      // Don't actually get the audio for test, just check connectivity
      result.audio_available = true;
    }

    res.json(result);

  } catch (error) {
    res.json({
      success: false,
      api_key_configured: !!SPEECHMATICS_API_KEY,
      error: error.message,
      service: 'Speechmatics TTS (Preview)',
      endpoint: 'https://preview.tts.speechmatics.com/generate/'
    });
  }
});

// Get available voices
app.get('/api/voices', (req, res) => {
  const voices = Object.entries(SPEECHMATICS_VOICES).map(([name, id]) => ({
    id,
    name,
    description: getVoiceDescription(name)
  }));
  
  res.json({ 
    success: true, 
    voices,
    service: 'Speechmatics TTS (Preview)'
  });
});

// Helper function for voice descriptions
function getVoiceDescription(voiceName) {
  const descriptions = {
    'SARAH': "Sarah - English Female (UK)",
    'THEO': "Theo - English Male (UK)", 
    'MEGAN': "Megan - English Female (US)",
    'JACK': "Jack - English Male (US)"
  };
  return descriptions[voiceName] || 'Unknown voice';
}

// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET  /',
      'GET  /health', 
      'POST /api/tts',
      'POST /api/tts/test',
      'GET  /api/voices'
    ]
  });
});

app.listen(PORT, () => {
  console.log('🚀 Speechmatics TTS Server started!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${SPEECHMATICS_API_KEY ? '✅ CONFIGURED' : '❌ MISSING'}`);
  console.log('🎙️  Available Voices:');
  Object.entries(SPEECHMATICS_VOICES).forEach(([name, id]) => {
    console.log(`   ${name}: ${id}`);
  });
  console.log('🎯 Using endpoint: https://preview.tts.speechmatics.com/generate/');
  console.log('💡 Service: Speechmatics TTS (Preview) - FREE TO USE');
});