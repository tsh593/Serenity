// Puter.js TTS Service - Fixed to handle Puter.js response format

// Available Puter.js voices (from the error message)
export const PUTER_VOICES = {
  AMY: 'Amy',           // Female voice
  EMMA: 'Emma',         // Female voice
  NICOLE: 'Nicole',     // Female voice
  IVY: 'Ivy',           // Female voice
  JOANNA: 'Joanna',     // Female voice
  KENDRA: 'Kendra',     // Female voice
  KIMBERLY: 'Kimberly', // Female voice
  SEOYEON: 'Seoyeon',   // Female voice (Korean accent)
  BRIAN: 'Brian',       // Male voice
  RUSSELL: 'Russell',   // Male voice
  VASILIS: 'Vasilis',   // Male voice
  JOEY: 'Joey',         // Male voice
  PEDRO: 'Pedro',       // Male voice
  STEPHEN: 'Stephen'    // Male voice
};

const DEFAULT_VOICE = PUTER_VOICES.JOANNA;

// Check if Puter.js is properly loaded and authenticated
export const isPuterReady = () => {
  return typeof puter !== 'undefined' && 
         puter.ai && 
         puter.ai.txt2speech;
};

// Sign in to Puter.js
export const signInToPuter = async () => {
  try {
    console.log('🔐 Signing in to Puter.js...');
    await puter.auth.signIn();
    console.log('✅ Signed in to Puter.js successfully');
    return true;
  } catch (error) {
    console.error('❌ Puter.js sign-in failed:', error);
    throw error;
  }
};

// Check if user is signed in
export const checkPuterSignIn = async () => {
  try {
    if (!isPuterReady()) {
      return false;
    }
    const isSignedIn = await puter.auth.isSignedIn();
    console.log('🔐 Puter.js sign-in status:', isSignedIn);
    return isSignedIn;
  } catch (error) {
    console.error('❌ Error checking Puter.js sign-in:', error);
    return false;
  }
};

// Extract audio URL from Puter.js response
// Extract audio URL from Puter.js response
const extractAudioUrl = (result) => {
  console.log('🔍 Parsing Puter.js response:', result);
  
  // If it's already a string URL, return it
  if (typeof result === 'string' && result.startsWith('http')) {
    return result;
  }
  
  // If it's an HTML string with audio element, extract the src
  if (typeof result === 'string' && result.includes('<audio')) {
    const srcMatch = result.match(/src="([^"]*)"/);
    if (srcMatch && srcMatch[1]) {
      const audioUrl = srcMatch[1];
      console.log('🎵 Extracted audio URL from HTML string:', audioUrl);
      return audioUrl;
    }
  }
  
  // If it's an object with audio_url property
  if (result && result.audio_url) {
    return result.audio_url;
  }
  
  // If it's a DOM element
  if (result instanceof HTMLElement && result.tagName === 'AUDIO') {
    return result.src;
  }
  
  // If it's a data URL (base64 audio)
  if (typeof result === 'string' && result.includes('data:audio/')) {
    return result;
  }
  
  console.error('❌ Could not extract audio URL from Puter.js response:', result);
  throw new Error('Invalid response from Puter.js TTS - could not extract audio URL');
};

export const generateSpeechPuter = async (text, emotion = 'neutral', selectedVoice = DEFAULT_VOICE) => {
  console.log('🚀 Puter.js TTS Request:', text.substring(0, 50) + '...');
  console.log('🎭 Selected Voice:', selectedVoice);

  try {
    // Check if Puter.js is ready
    if (!isPuterReady()) {
      throw new Error('Puter.js not loaded. Make sure the script is included.');
    }

    // Check if user is signed in
    const isSignedIn = await checkPuterSignIn();
    if (!isSignedIn) {
      throw new Error('Please sign in to Puter.js to use TTS');
    }

    // Map emotions to voice parameters
    const emotionConfig = {
      'happy': { speed: 1.1 },
      'joyful': { speed: 1.2 },
      'excited': { speed: 1.3 },
      'concerned': { speed: 0.9 },
      'sad': { speed: 0.8 },
      'thoughtful': { speed: 1.0 },
      'explain': { speed: 1.0 },
      'neutral': { speed: 1.0 },
      'surprised': { speed: 1.2 }
    };

    const config = emotionConfig[emotion] || emotionConfig.neutral;
    
    console.log('📡 Sending request to Puter.js...');
    console.log('⚙️ Voice Settings:', { voice: selectedVoice, ...config });
    
    // Use Puter.js text-to-speech
    const result = await puter.ai.txt2speech(text, {
      voice: selectedVoice,
      speed: config.speed,
      model: 'tts-1'
    });

    console.log('✅ Puter.js TTS SUCCESS! Raw result:', result);
    
    // Extract the audio URL from the response
    const audioUrl = extractAudioUrl(result);
    console.log('🎵 Extracted audio URL:', audioUrl);
    
    return audioUrl;
    
  } catch (error) {
    console.error('❌ Puter.js TTS failed:', error);
    throw new Error(`Puter.js TTS Error: ${error.message || error}`);
  }
};

export const playAudio = (audioUrl) => {
  return new Promise((resolve, reject) => {
    console.log('🎵 Playing audio from URL:', audioUrl);
    
    if (!audioUrl) {
      reject(new Error('No audio URL provided'));
      return;
    }

    const audio = new Audio(audioUrl);
    
    audio.onloadeddata = () => {
      console.log('✅ Audio loaded, playing...');
    };
    
    audio.onended = () => {
      console.log('✅ Audio playback completed');
      resolve();
    };
    
    audio.onerror = (error) => {
      console.error('❌ Audio playback error:', error);
      reject(error);
    };
    
    // Add event listener for when audio can be played
    audio.addEventListener('canplaythrough', () => {
      console.log('🎵 Audio ready to play');
      audio.play().catch(reject);
    });
    
    // Fallback: if canplaythrough doesn't fire, try to play after 1 second
    setTimeout(() => {
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or more
        audio.play().catch(reject);
      }
    }, 1000);
  });
};

// Main TTS function - Puter.js only, no fallbacks
export const generateSpeech = async (text, emotion = 'neutral', selectedVoice = DEFAULT_VOICE) => {
  console.log('🔊 Puter.js TTS Request:', text.substring(0, 50) + '...');
  
  // Only use Puter.js - no fallbacks
  const audioUrl = await generateSpeechPuter(text, emotion, selectedVoice);
  return audioUrl;
};